import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, X, Calendar, DollarSign, Award, ShieldAlert, Folder, Clock, CheckCircle, Star } from "lucide-react";

import { deptColor, formatInr, statusColor } from "../../data/hrMasterData";
import { getAttendance, getLeaveEnriched, getPayrollEnriched, getPerformanceReviews } from "../../api/hrApi";

const TABS = ["Personal", "Job", "Attendance", "Leave", "Payroll", "Performance", "Assets"];

export default function EmployeeDetailModal({ employee, onClose }) {
  const [tab, setTab] = useState("Personal");
  const [loading, setLoading] = useState(false);

  // Dynamic profile states
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (!employee) return;
    setLoading(true);

    // Load related data from APIs & localStorage
    Promise.allSettled([
      getAttendance({ employee_id: employee.id }),
      getLeaveEnriched(),
      getPayrollEnriched(),
      getPerformanceReviews(null, employee.id),
    ])
      .then(([attRes, leaveRes, payRes, perfRes]) => {
        if (attRes.status === "fulfilled") {
          setAttendance(attRes.value.data || []);
        }
        if (leaveRes.status === "fulfilled") {
          const list = leaveRes.value.data || [];
          setLeaves(list.filter((l) => l.employee_name === employee.full_name || l.employee_id === employee.id));
        }
        if (payRes.status === "fulfilled") {
          const list = payRes.value.data || [];
          setPayroll(list.filter((p) => p.employee_name === employee.full_name || p.employee_id === employee.id));
        }
        if (perfRes.status === "fulfilled") {
          setPerformance(perfRes.value.data || []);
        }

        // Load assets assigned to this employee from local storage
        const storedAssets = localStorage.getItem("smrt_assets");
        if (storedAssets) {
          const assetsList = JSON.parse(storedAssets);
          setAssets(assetsList.filter((a) => a.assigned_to === employee.full_name));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [employee]);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Profile Summary */}
        <div className="flex items-start gap-4 border-b px-6 py-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB] text-lg font-bold text-white uppercase shadow-md">
            {employee.initials || "?"}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">{employee.employee_id || employee.employee_code}</p>
            <h2 className="text-xl font-bold text-slate-900">{employee.full_name}</h2>
            <p className="text-sm text-slate-500 font-medium">
              {employee.designation || "Operator"} · <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${deptColor(employee.department)}`}>{employee.department || "Production"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b px-6 bg-slate-50">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-xs font-bold transition-all ${
                tab === t ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Contents Viewport */}
        <div className="overflow-y-auto px-6 py-5 flex-1 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2563EB]" />
              <p className="mt-2 text-xs font-medium text-slate-500">Loading profile data...</p>
            </div>
          ) : (
            <>
              {tab === "Personal" && (
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <Field label="Phone" value={employee.phone} icon={Phone} />
                  <Field label="Email" value={employee.email} icon={Mail} />
                  <Field label="Joining Date" value={employee.joining_date || employee.hire_date} />
                  <Field label="Employment Type" value={employee.employment_type} />
                  <Field label="Hourly Rate" value={employee.hourly_rate ? `₹${employee.hourly_rate}/hr` : "—"} />
                  <Field label="Monthly Salary" value={employee.salary ? formatInr(employee.salary) : "—"} />
                  <Field label="Status">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(employee.status || "active")}`}>
                      {employee.status || "active"}
                    </span>
                  </Field>
                </div>
              )}

              {tab === "Job" && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Department" value={employee.department || "Production"} />
                  <Field label="Designation" value={employee.designation || "Operator"} />
                  <Field label="Current Shift" value={employee.shift || employee.shift_name || "General Shift"} />
                  <Field label="Reporting Manager" value={employee.reporting_manager || "Not Assigned"} />
                </div>
              )}

              {tab === "Attendance" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Recent Logs</h4>
                  {attendance.length > 0 ? (
                    <div className="divide-y rounded-xl border bg-slate-50 px-3 py-1 text-xs">
                      {attendance.slice(0, 5).map((att) => (
                        <div key={att.id} className="flex justify-between py-2 items-center">
                          <span className="font-semibold text-slate-700">{att.record_date}</span>
                          <span className="text-slate-500">In: {att.clock_in ? String(att.clock_in).slice(11, 16) : "—"} · Out: {att.clock_out ? String(att.clock_out).slice(11, 16) : "—"}</span>
                          <span className={`rounded-full px-2 py-0.5 font-bold uppercase text-[9px] ${statusColor(att.status)}`}>{att.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic py-4">No attendance records logged for {employee.full_name}.</p>
                  )}
                </div>
              )}

              {tab === "Leave" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Requested Leave Applications</h4>
                  {leaves.length > 0 ? (
                    <div className="divide-y rounded-xl border bg-slate-50 px-3 py-1 text-xs">
                      {leaves.map((l) => (
                        <div key={l.id} className="flex justify-between py-2 items-center">
                          <div>
                            <span className="font-semibold text-slate-800 capitalize">{l.leave_type} Leave</span>
                            <p className="text-[10px] text-slate-400">{l.start_date} to {l.end_date} ({l.days} days)</p>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 font-bold uppercase text-[9px] ${statusColor(l.status)}`}>{l.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic py-4">No leave requests recorded for {employee.full_name}.</p>
                  )}
                </div>
              )}

              {tab === "Payroll" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Processed Payslips</h4>
                  {payroll.length > 0 ? (
                    <div className="divide-y rounded-xl border bg-slate-50 px-3 py-1 text-xs">
                      {payroll.map((p) => (
                        <div key={p.id} className="flex justify-between py-2 items-center">
                          <div>
                            <span className="font-semibold text-slate-800">{p.period_start} to {p.period_end}</span>
                            <p className="text-[10px] text-slate-400">Net salary paid</p>
                          </div>
                          <span className="font-bold text-slate-900">{formatInr(p.net_salary)}</span>
                          <span className={`rounded-full px-2 py-0.5 font-bold uppercase text-[9px] ${statusColor(p.status)}`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic py-4">No payroll registers computed for {employee.full_name}.</p>
                  )}
                </div>
              )}

              {tab === "Performance" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Evaluations log</h4>
                  {performance.length > 0 ? (
                    <div className="divide-y rounded-xl border bg-slate-50 px-3 py-1 text-xs">
                      {performance.map((pf) => (
                        <div key={pf.id} className="py-2.5 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-800">{pf.review_period}</span>
                            <span className="inline-flex items-center gap-0.5 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              {pf.rating || 0}/5
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 italic">" {pf.notes || "No notes"} "</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic py-4">No performance evaluations found for {employee.full_name}.</p>
                  )}
                </div>
              )}

              {tab === "Assets" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Assigned Hardware & Gear</h4>
                  {assets.length > 0 ? (
                    <div className="divide-y rounded-xl border bg-slate-50 px-3 py-1 text-xs">
                      {assets.map((ast) => (
                        <div key={ast.id} className="flex justify-between py-2 items-center">
                          <div>
                            <span className="font-semibold text-slate-800">{ast.name}</span>
                            <p className="text-[10px] text-slate-400">Code: {ast.asset_code} · {ast.category}</p>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 font-bold uppercase text-[9px] bg-green-100 text-green-700`}>{ast.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic py-4">No registered assets assigned to {employee.full_name}.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-slate-50 justify-end">
          <Link to="/hr/attendance" className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Attendance Registry</Link>
          <Link to="/hr/payroll" className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all">View Payroll</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, children, icon: Icon }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 border border-slate-100 shadow-sm">
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{label}</p>
      {children || (
        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
          {Icon && <Icon className="h-4 w-4 text-slate-400" />}{value ?? "—"}
        </p>
      )}
    </div>
  );
}
