import api from "./axiosConfig";

export const getAnalyticsDashboard = (tenantId, year = null) =>
  api.get("/analytics/dashboard", {
    params: { tenant_id: tenantId, year: year || new Date().getFullYear() },
  });
