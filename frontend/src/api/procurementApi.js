import api from "./axiosConfig";

export const getPurchaseOrders = (tenantId) =>
  api.get("/procurement/purchase-orders", { params: { tenant_id: tenantId } });

export const createPurchaseOrder = (payload) =>
  api.post("/procurement/purchase-orders", payload);

export const getVendors = (tenantId) =>
  api.get("/procurement/vendors", { params: { tenant_id: tenantId } });

export const getMaterialRequests = (tenantId) =>
  api.get("/procurement/material-requests", { params: { tenant_id: tenantId } });

export const createMaterialRequest = (payload) =>
  api.post("/procurement/material-requests", payload);

export const getGoodsReceipts = (tenantId) =>
  api.get("/procurement/goods-receipt", { params: { tenant_id: tenantId } });

export const createGoodsReceipt = (payload) =>
  api.post("/procurement/goods-receipt", payload);

export const getSupplierPayments = (tenantId) =>
  api.get("/procurement/supplier-payments", { params: { tenant_id: tenantId } });

export const createSupplierPayment = (payload) =>
  api.post("/procurement/supplier-payments", payload);
