import api from "./axiosConfig";

export const getHrDashboard = (tenantId) =>
  api.get("/hr/dashboard", { params: { tenant_id: tenantId } });

export const getEmployees = (tenantId) =>
  api.get("/hr/employees", { params: { tenant_id: tenantId } });

export const createEmployee = (payload) => api.post("/hr/employees", payload);

export const getShifts = (tenantId) =>
  api.get("/hr/shifts", { params: { tenant_id: tenantId } });

export const createShift = (payload) => api.post("/hr/shifts", payload);

export const getAttendance = (tenantId, params = {}) =>
  api.get("/hr/attendance", { params: { tenant_id: tenantId, ...params } });

export const createAttendance = (payload) => api.post("/hr/attendance", payload);

export const clockIn = (tenantId, employeeId, recordDate) =>
  api.post("/hr/attendance/clock-in", null, {
    params: { tenant_id: tenantId, employee_id: employeeId, record_date: recordDate },
  });

export const clockOut = (tenantId, employeeId, recordDate) =>
  api.post("/hr/attendance/clock-out", null, {
    params: { tenant_id: tenantId, employee_id: employeeId, record_date: recordDate },
  });

export const getPayroll = (tenantId, params = {}) =>
  api.get("/hr/payroll", { params: { tenant_id: tenantId, ...params } });

export const createPayroll = (payload) => api.post("/hr/payroll", payload);

export const getPerformanceReviews = (tenantId, employeeId = null) =>
  api.get("/hr/performance", {
    params: { tenant_id: tenantId, employee_id: employeeId },
  });

export const createPerformanceReview = (payload) =>
  api.post("/hr/performance", payload);
