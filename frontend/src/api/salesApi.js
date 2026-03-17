import api from "./axiosConfig";

export const getCustomers = (tenantId) =>
  api.get("/sales/customers", { params: { tenant_id: tenantId } });

export const createCustomer = (payload) =>
  api.post("/sales/customers", payload);

export const getSalesOrders = (tenantId, status = null) =>
  api.get("/sales/sales-orders", {
    params: { tenant_id: tenantId, status },
  });

export const createSalesOrder = (payload) =>
  api.post("/sales/sales-orders", payload);

export const getInvoices = (tenantId, status = null) =>
  api.get("/sales/invoices", {
    params: { tenant_id: tenantId, status },
  });

export const getInvoiceDetail = (invoiceId) =>
  api.get(`/sales/invoices/${invoiceId}`);

export const createInvoice = (payload) =>
  api.post("/sales/invoices", payload);

export const getPayments = (tenantId, invoiceId = null) =>
  api.get("/sales/payments", {
    params: { tenant_id: tenantId, invoice_id: invoiceId },
  });

export const createPayment = (payload) =>
  api.post("/sales/payments", payload);
