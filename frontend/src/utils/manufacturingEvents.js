/**
 * Lightweight pub/sub so manufacturing mutations can refresh related screens
 * (WO → inventory → dashboard) without a full page reload.
 */

const listeners = new Set();

export const MANUFACTURING_EVENTS = {
  WORK_ORDER_UPDATED: "work_order_updated",
  MATERIALS_ISSUED: "materials_issued",
  WORK_ORDER_COMPLETED: "work_order_completed",
  MRP_RUN: "mrp_run",
  MATERIAL_REQUEST_CONVERTED: "material_request_converted",
  PURCHASE_ORDER_CREATED: "purchase_order_created",
  GRN_RECEIVED: "grn_received",
  GRN_QC_PASSED: "grn_qc_passed",
  ORDER_PACKED: "order_packed",
  ORDER_SHIPPED: "order_shipped",
  INVOICE_CREATED: "invoice_created",
  PAYMENT_RECORDED: "payment_recorded",
  INVENTORY_CHANGED: "inventory_changed",
  DASHBOARD_REFRESH: "dashboard_refresh",
};

export function emitManufacturingEvent(type, payload = {}) {
  const event = { type, payload, at: Date.now() };
  listeners.forEach((fn) => {
    try {
      fn(event);
    } catch {
      /* ignore listener errors */
    }
  });
  // Also notify same-tab consumers via a custom DOM event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("gns:manufacturing", { detail: event }));
  }
}

export function subscribeManufacturingEvents(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

/** After WO complete / material issue — refresh spine modules. */
export function notifyManufacturingSpine(type, payload = {}) {
  emitManufacturingEvent(type, payload);
  emitManufacturingEvent(MANUFACTURING_EVENTS.INVENTORY_CHANGED, payload);
  emitManufacturingEvent(MANUFACTURING_EVENTS.DASHBOARD_REFRESH, payload);
}
