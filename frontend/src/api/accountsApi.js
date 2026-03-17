import api from "./axiosConfig";

export const getAccountsDashboard = (tenantId) =>
  api.get("/accounts/dashboard", { params: { tenant_id: tenantId } });

export const getProfitLoss = (tenantId, year, ytdMonth = 12) =>
  api.get("/accounts/profit-loss", {
    params: { tenant_id: tenantId, year, ytd_month: ytdMonth },
  });

export const getTaxReport = (tenantId, year) =>
  api.get("/accounts/tax-report", {
    params: { tenant_id: tenantId, year },
  });

export const listIncome = (tenantId, year = null) =>
  api.get("/accounts/income", {
    params: { tenant_id: tenantId, year },
  });

export const listExpenses = (tenantId, year = null) =>
  api.get("/accounts/expenses", {
    params: { tenant_id: tenantId, year },
  });

export const createIncome = (payload) => api.post("/accounts/income", payload);
export const createExpense = (payload) => api.post("/accounts/expenses", payload);
