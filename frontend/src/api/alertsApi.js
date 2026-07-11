import api from "./axiosConfig";

export const getAlerts = (params = {}) =>
  api.get("/alerts", { params: { ...params } });

export const getNotifications = () => api.get("/alerts/notifications");

export const markNotificationsRead = (notificationIds = null) =>
  api.post("/alerts/notifications/read", { notification_ids: notificationIds });

export const clearNotifications = () => api.delete("/alerts/notifications/clear");

export const syncLowStockAlerts = () => api.post("/alerts/sync-low-stock");

export const createAlert = (payload) => api.post("/alerts", payload);

export const acknowledgeAlert = (alertId) =>
  api.post(`/alerts/${alertId}/acknowledge`);
