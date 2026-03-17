import api from "./axiosConfig";

export const getUsers = (tenantId = 1) =>
  api.get("/admin/users", { params: { tenant_id: tenantId } });

export const getRoles = (tenantId = 1) =>
  api.get("/admin/roles", { params: { tenant_id: tenantId } });
