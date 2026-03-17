import api from "./axiosConfig";

export const getWarehouses = (tenantId) =>
  api.get("/inventory/warehouses", { params: { tenant_id: tenantId } });

export const createWarehouse = (payload) =>
  api.post("/inventory/warehouses", payload);

export const getSuppliers = (tenantId) =>
  api.get("/inventory/suppliers", { params: { tenant_id: tenantId } });

export const createSupplier = (payload) =>
  api.post("/inventory/suppliers", payload);

export const getInventoryItems = (tenantId, lowStockOnly = false) =>
  api.get("/inventory/items", {
    params: { tenant_id: tenantId, low_stock_only: lowStockOnly },
  });

export const createInventoryItem = (payload) =>
  api.post("/inventory/items", payload);

export const getItemByBarcode = (tenantId, barcode) =>
  api.get(`/inventory/items/barcode/${encodeURIComponent(barcode)}`, {
    params: { tenant_id: tenantId },
  });

export const getInventoryDashboard = (tenantId) =>
  api.get("/inventory/dashboard", { params: { tenant_id: tenantId } });

export const getStockByWarehouse = (warehouseId) =>
  api.get(`/inventory/stock-levels/warehouse/${warehouseId}`);

export const getStockByItem = (itemId) =>
  api.get(`/inventory/stock-levels/item/${itemId}`);

export const updateStock = (warehouseId, itemId, quantity) =>
  api.put("/inventory/stock-levels", null, {
    params: { warehouse_id: warehouseId, item_id: itemId, quantity },
  });

export const recordStockMovement = (payload) =>
  api.post("/inventory/stock-movements", payload);
