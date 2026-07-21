<<<<<<< HEAD
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Briefcase, Clock, IndianRupee, RefreshCw, UserCheck, Users } from "lucide-react";

import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getHRHub } from "../../api/hrApi";
import { DEMO_HR_HUB, HR_FLOW, formatInr } from "../../data/hrMasterData";

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{value}</p></div>
        {Icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>}
      </div>
    </div>
  );
}

const alertIcons = { certification: AlertTriangle, leave: Briefcase, payroll: IndianRupee, attendance: Clock };

export default function HRDashboard() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hub, setHub] = useState(DEMO_HR_HUB);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHRHub();
      if (res.data) setHub({ ...DEMO_HR_HUB, ...res.data });
    } catch {
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader label="Loading HR dashboard..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Workforce analytics, attendance, leave, payroll, and manufacturing HR insights.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Employees" value={hub.total_employees} icon={Users} color="bg-blue-600" />
        <KpiCard label="Present Today" value={hub.present_today} icon={UserCheck} color="bg-green-600" />
        <KpiCard label="Pending Leave" value={hub.pending_leave} icon={Briefcase} color="bg-amber-500" />
        <KpiCard label="Monthly Payroll" value={formatInr(hub.monthly_payroll)} icon={IndianRupee} color="bg-indigo-600" />
        <KpiCard label="Overtime (h)" value={hub.overtime_hours} icon={Clock} color="bg-orange-500" />
        <KpiCard label="New Joiners" value={hub.new_joiners} icon={Users} color="bg-teal-600" />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-medium text-slate-600 sm:text-xs">
        {HR_FLOW.map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span className="rounded bg-white px-1.5 py-0.5 shadow-sm">{s}</span>
            {i < HR_FLOW.length - 1 && <span className="text-slate-400">↓</span>}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Department Strength</h2>
          <ul className="space-y-2">
            {(hub.department_strength || []).map((d) => (
              <li key={d.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium">{d.name}</span>
                <span className="font-semibold text-[#2563EB]">{d.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Shift Utilization</h2>
          <ul className="space-y-3">
            {(hub.shift_utilization || []).map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{s.name}</span><span className="text-slate-500">{s.utilization}%</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${s.utilization}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Alerts & Notifications</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(hub.alerts || []).map((a, i) => {
            const Icon = alertIcons[a.type] || AlertTriangle;
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-900">{a.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/hr/employees" label="Employees" />
        <QuickLink to="/hr/attendance" label="Attendance" />
        <QuickLink to="/hr/leave" label="Leave" />
        <QuickLink to="/hr/payroll" label="Payroll" />
        <QuickLink to="/hr/shifts" label="Shifts" />
        <QuickLink to="/hr/performance" label="Performance" />
        <QuickLink to="/masters/departments" label="Departments" />
        <QuickLink to="/production/tasks" label="Machine Allocation" />
      </div>
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#2563EB] hover:text-[#2563EB]">
      {label} →
    </Link>
  );
}
=======
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Briefcase, Clock, IndianRupee, Plus, RefreshCw, UserCheck, Users, XCircle, ShieldAlert, FileText, Package, ShieldCheck } from "lucide-react";

import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { createEmployee, getHRHub } from "../../api/hrApi";
import { DEMO_HR_HUB, HR_FLOW, formatInr } from "../../data/hrMasterData";
import useTenantId from "../../hooks/useTenantId";

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{value}</p></div>
        {Icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>}
      </div>
    </div>
  );
}

const alertIcons = { certification: AlertTriangle, leave: Briefcase, payroll: IndianRupee, attendance: Clock };

export default function HRDashboard() {
  const { addToast } = useToast();
  const tenantId = useTenantId();
  const [loading, setLoading] = useState(true);
  const [hub, setHub] = useState(DEMO_HR_HUB);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // New states for compliance/operations
  const [assetsCount, setAssetsCount] = useState(0);
  const [incidentsCount, setIncidentsCount] = useState(0);

  const [newEmployee, setNewEmployee] = useState({
    tenant_id: tenantId,
    employee_code: "",
    full_name: "",
    email: "",
    department: "",
    hire_date: "",
    hourly_rate: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHRHub();
      if (res.data) setHub({ ...DEMO_HR_HUB, ...res.data });

      // Load assets from local storage
      const storedAssets = localStorage.getItem("smrt_assets");
      const assetsList = storedAssets ? JSON.parse(storedAssets) : [];
      setAssetsCount(assetsList.length);

      // Load incidents from local storage
      const storedIncidents = localStorage.getItem("smrt_incidents");
      const incidentsList = storedIncidents ? JSON.parse(storedIncidents) : [];
      setIncidentsCount(incidentsList.filter((i) => i.status !== "Resolved").length);


    } catch {
      addToast("Using demo HR hub data", "info");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createEmployee({
        ...newEmployee,
        tenant_id: tenantId,
        hire_date: newEmployee.hire_date || null,
        hourly_rate: newEmployee.hourly_rate ? Number(newEmployee.hourly_rate) : null,
      });
      addToast("Employee created successfully", "success");
      setShowCreate(false);
      setNewEmployee({
        tenant_id: tenantId,
        employee_code: "",
        full_name: "",
        email: "",
        department: "",
        hire_date: "",
        hourly_rate: "",
      });
      load();
    } catch (err) {
      const detail = err.response?.data?.detail || "Employee creation failed";
      setError(detail);
      addToast(detail, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading HR dashboard..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Workforce analytics, attendance, leave, payroll, and manufacturing HR insights.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowCreate(true)} className="ui-btn-primary"><Plus className="h-4 w-4" /> Create Employee</button>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Employees" value={hub.total_employees} icon={Users} color="bg-blue-600" />
        <KpiCard label="Present Today" value={hub.present_today} icon={UserCheck} color="bg-green-600" />
        <KpiCard label="Pending Leave" value={hub.pending_leave} icon={Briefcase} color="bg-amber-500" />
        <KpiCard label="Monthly Payroll" value={formatInr(hub.monthly_payroll)} icon={IndianRupee} color="bg-indigo-600" />
        <KpiCard label="Overtime (h)" value={hub.overtime_hours} icon={Clock} color="bg-orange-500" />
        <KpiCard label="New Joiners" value={hub.new_joiners} icon={Users} color="bg-teal-600" />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-medium text-slate-600 sm:text-xs">
        {HR_FLOW.map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span className="rounded bg-white px-1.5 py-0.5 shadow-sm">{s}</span>
            {i < HR_FLOW.length - 1 && <span className="text-slate-400">↓</span>}
          </span>
        ))}
      </div>

      {/* Compliance & Safety Widgets Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Incidents</p>
            <p className={`mt-1 text-2xl font-bold ${incidentsCount > 0 ? "text-rose-600" : "text-slate-900"}`}>{incidentsCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Pending safety investigation</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${incidentsCount > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"}`}>
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Managed Assets</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{assetsCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Assigned company equipment</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#2563EB]">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Department Strength</h2>
          <ul className="space-y-2">
            {(hub.department_strength || []).map((d) => (
              <li key={d.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium">{d.name}</span>
                <span className="font-semibold text-[#2563EB]">{d.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Shift Utilization</h2>
          <ul className="space-y-3">
            {(hub.shift_utilization || []).map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{s.name}</span><span className="text-slate-500">{s.utilization}%</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${s.utilization}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Alerts & Notifications</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(hub.alerts || []).map((a, i) => {
            const Icon = alertIcons[a.type] || AlertTriangle;
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-900">{a.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <QuickLink to="/hr/employees" label="Employees" />
        <QuickLink to="/hr/attendance" label="Attendance" />
        <QuickLink to="/hr/leave" label="Leave" />
        <QuickLink to="/hr/payroll" label="Payroll" />
        <QuickLink to="/hr/shifts" label="Shifts" />
        <QuickLink to="/hr/performance" label="Performance" />
        <QuickLink to="/hr/incidents" label="Safety & Incidents" />
        <QuickLink to="/hr/assets" label="Asset Management" />
        <QuickLink to="/masters/departments" label="Departments" />
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Employee</h2>
                <p className="mt-1 text-sm text-slate-500">Follow the same lightweight workflow as a new lead entry.</p>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><XCircle className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-4 overflow-y-auto p-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Employee Code</label>
                <input required value={newEmployee.employee_code} onChange={(e) => setNewEmployee({ ...newEmployee, employee_code: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="e.g. EMP001" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500">Full Name</label>
                  <input required value={newEmployee.full_name} onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500">Department</label>
                  <input value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="e.g. HR" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500">Email</label>
                  <input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500">Hire Date</label>
                  <input type="date" value={newEmployee.hire_date} onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Hourly Rate</label>
                <input type="number" step="0.01" value={newEmployee.hourly_rate} onChange={(e) => setNewEmployee({ ...newEmployee, hourly_rate: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="e.g. 15" />
              </div>
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
              <div className="flex justify-end gap-2 border-t pt-4">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save Employee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
      {label} →
    </Link>
  );
}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
