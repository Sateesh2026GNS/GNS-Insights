import api from "./axiosConfig";

export const getLiveProduction = () =>
  api.get("/factory-monitor/live-production");

export const getFactoryMachineStatus = () =>
  api.get("/factory-monitor/machine-status");

export const getProductionLines = () =>
  api.get("/factory-monitor/production-lines");

export const getShopFloorSummary = () =>
<<<<<<< HEAD
  api.get("/factory-monitor/shop-floor/summary");

export const getShopFloorGrid = () =>
  api.get("/factory-monitor/shop-floor/grid");

export const getShopFloorAlerts = () =>
  api.get("/factory-monitor/shop-floor/alerts");

export const getShopFloorTimeline = () =>
  api.get("/factory-monitor/shop-floor/timeline");
=======
  api.get("/api/shopfloor/status");

export const getShopFloorGrid = () =>
  api.get("/api/shopfloor/live");

export const getShopFloorAlerts = () =>
  api.get("/api/shopfloor/live");

export const getShopFloorTimeline = () =>
  api.get("/api/shopfloor/live");

export const getShopFloorLive = () =>
  api.get("/api/shopfloor/live");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
