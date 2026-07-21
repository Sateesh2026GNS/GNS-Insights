import { useEffect } from "react";

import {
  MANUFACTURING_EVENTS,
  subscribeManufacturingEvents,
} from "../utils/manufacturingEvents";

/**
 * Re-run `onRefresh` when manufacturing spine events fire.
 * @param {() => void | Promise<void>} onRefresh
 * @param {string[]} [eventTypes]
 */
export default function useManufacturingRefresh(
  onRefresh,
  eventTypes = [
    MANUFACTURING_EVENTS.WORK_ORDER_COMPLETED,
    MANUFACTURING_EVENTS.MATERIALS_ISSUED,
    MANUFACTURING_EVENTS.INVENTORY_CHANGED,
    MANUFACTURING_EVENTS.DASHBOARD_REFRESH,
    MANUFACTURING_EVENTS.MRP_RUN,
  ]
) {
  useEffect(() => {
    if (!onRefresh) return undefined;
    const types = new Set(eventTypes);
    return subscribeManufacturingEvents((event) => {
      if (types.has(event.type)) {
        onRefresh(event);
      }
    });
  }, [onRefresh, eventTypes]);
}
