import api from "./axiosConfig";

const TENANT = (tenantId) => ({ params: { tenant_id: tenantId ?? 1 } });

export const getIotDashboard = (tenantId) =>
  api.get("/iot/dashboard", TENANT(tenantId));

export const getWearables = (tenantId) =>
  api.get("/iot/wearables", TENANT(tenantId));

export const getMachineAnalytics = (tenantId) =>
  api.get("/iot/machine-analytics", TENANT(tenantId));

export const getIotSensors = (tenantId) =>
  api.get("/iot/sensors", TENANT(tenantId));

export const getCobots = (tenantId) =>
  api.get("/iot/cobots", TENANT(tenantId));

export const getAgvs = (tenantId) =>
  api.get("/iot/agvs", TENANT(tenantId));

export const getDrones = (tenantId) =>
  api.get("/iot/drones", TENANT(tenantId));

export const getSmartPackaging = (tenantId) =>
  api.get("/iot/smart-packaging", TENANT(tenantId));

export const getLiveOperations = (tenantId) =>
  api.get("/iot/live-operations", TENANT(tenantId));
