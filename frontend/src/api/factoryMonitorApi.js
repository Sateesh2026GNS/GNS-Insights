import api from "./axiosConfig";

export const getLiveProduction = () =>
  api.get("/factory-monitor/live-production");

export const getFactoryMachineStatus = () =>
  api.get("/factory-monitor/machine-status");

export const getProductionLines = () =>
  api.get("/factory-monitor/production-lines");

export const getShopFloorSummary = () =>
  api.get("/api/shopfloor/status");

export const getShopFloorGrid = () =>
  api.get("/api/shopfloor/live");

export const getShopFloorAlerts = () =>
  api.get("/api/shopfloor/live");

export const getShopFloorTimeline = () =>
  api.get("/api/shopfloor/live");

export const getShopFloorLive = () =>
  api.get("/api/shopfloor/live");
