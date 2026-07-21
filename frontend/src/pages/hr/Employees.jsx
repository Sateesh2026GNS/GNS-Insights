<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Filter, Plus, RefreshCw, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import EmployeeDetailModal from "../../components/hr/EmployeeDetailModal";
import { useToast } from "../../context/ToastContext";
import { getEmployeeSummary, getEmployeesEnriched } from "../../api/hrApi";
import { DEMO_EMP_LIST, DEMO_EMP_SUMMARY, deptColor, formatInr, statusColor } from "../../data/hrMasterData";

function KpiCard({ label, value, icon: Icon, color, suffix }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}{suffix || ""}</p></div>
        {Icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>}
      </div>
    </div>
  );
}

const defaultFilters = { department: "", employment_type: "", shift: "", status: "" };

export default function Employees() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(DEMO_EMP_SUMMARY);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, listRes] = await Promise.allSettled([getEmployeeSummary(), getEmployeesEnriched()]);
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary({ ...DEMO_EMP_SUMMARY, ...sumRes.value.data });
      if (listRes.status === "fulfilled" && listRes.value?.data?.length) setRows(listRes.value.data);
      else setRows([]);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filters.department) list = list.filter((r) => r.department === filters.department);
    if (filters.employment_type) list = list.filter((r) => r.employment_type === filters.employment_type);
    if (filters.shift) list = list.filter((r) => r.shift === filters.shift);
    return list;
  }, [rows, filters]);

  const columns = [
    { key: "photo", label: "Photo", render: (r) => (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">{r.initials || "?"}</div>
    )},
    { key: "employee_id", label: "Employee ID" },
    { key: "full_name", label: "Name", render: (r) => <span className="font-medium text-slate-900">{r.full_name}</span> },
    { key: "department", label: "Department", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${deptColor(r.department)}`}>{r.department}</span> },
    { key: "designation", label: "Designation" },
    { key: "shift", label: "Shift" },
    { key: "reporting_manager", label: "Manager", render: (r) => r.reporting_manager || "—" },
    { key: "employment_type", label: "Type", render: (r) => <span className="capitalize">{r.employment_type}</span> },
    { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span> },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "joining_date", label: "Joining", render: (r) => String(r.joining_date || "").slice(0, 10) || "—" },
    { key: "salary", label: "Salary", render: (r) => r.salary ? formatInr(r.salary) : "—" },
    { key: "actions", label: "Actions", render: (r) => (
      <button type="button" onClick={() => setSelected(r)} className="text-xs font-semibold text-[#2563EB] hover:underline">Profile</button>
    )},
  ];

  if (loading) return <Loader label="Loading employees..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="mt-1 text-sm text-slate-500">Enterprise employee management with 360° profile, shift, and payroll integration.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/hr/employees/create" className="ui-btn-primary"><Plus className="h-4 w-4" /> Create Employee</Link>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Total Employees" value={summary.total_employees} icon={Users} color="bg-blue-600" />
        <KpiCard label="Present Today" value={summary.present_today} icon={UserCheck} color="bg-green-600" />
        <KpiCard label="Absent" value={summary.absent} icon={UserMinus} color="bg-red-500" />
        <KpiCard label="On Leave" value={summary.on_leave} icon={Briefcase} color="bg-amber-500" />
        <KpiCard label="Overtime (h)" value={summary.overtime} icon={Briefcase} color="bg-orange-500" />
        <KpiCard label="Departments" value={summary.departments} icon={Users} color="bg-indigo-600" />
        <KpiCard label="Contract" value={summary.contract_employees} icon={Users} color="bg-teal-600" />
        <KpiCard label="New Joiners" value={summary.new_joiners} icon={UserPlus} color="bg-purple-600" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Filter className="h-4 w-4" /> Filters</button>
        {showAdvanced && (
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All Departments</option>
              {["Production", "Quality", "Maintenance", "Stores", "HR"].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filters.employment_type} onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All Types</option>
              {["permanent", "contract", "temporary"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filters.shift} onChange={(e) => setFilters({ ...filters, shift: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All Shifts</option>
              {["Morning", "General", "Evening", "Night"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <DataTable columns={columns} data={filtered} searchPlaceholder="Search employee, department..." searchKeys={["full_name", "employee_id", "department", "designation"]} />
      </div>

      {selected && <EmployeeDetailModal employee={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
=======
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Eye, Filter, Plus, RefreshCw, UserCheck, UserMinus, UserPlus, Users, X, Save } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import RowActionMenu from "../../components/common/RowActionMenu";
import Loader from "../../components/common/Loader";
import EmployeeDetailModal from "../../components/hr/EmployeeDetailModal";
import { useToast } from "../../context/ToastContext";
import { getEmployeeSummary, getEmployeesEnriched, createEmployee } from "../../api/hrApi";
import { DEMO_EMP_LIST, DEMO_EMP_SUMMARY, deptColor, formatInr, statusColor } from "../../data/hrMasterData";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

function KpiCard({ label, value, icon: Icon, color, suffix }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}{suffix || ""}</p></div>
        {Icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>}
      </div>
    </div>
  );
}

const defaultFilters = { department: "", employment_type: "", shift: "", status: "" };

export default function Employees() {
  const tenantId = useTenantId();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(DEMO_EMP_SUMMARY);
  const [rows, setRows] = useState(DEMO_EMP_LIST);
  const [filters, setFilters] = useState(defaultFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    tenant_id: tenantId,
    employee_code: "",
    full_name: "",
    email: "",
    department: "Production",
    designation: "Technician",
    shift_name: "General",
    reporting_manager: "",
    employment_type: "permanent",
    phone: "",
    salary: "",
    hire_date: new Date().toISOString().slice(0, 10),
    hourly_rate: "150",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, listRes] = await Promise.allSettled([getEmployeeSummary(), getEmployeesEnriched()]);
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary({ ...DEMO_EMP_SUMMARY, ...sumRes.value.data });
      if (listRes.status === "fulfilled" && listRes.value?.data?.length) setRows(listRes.value.data);
      else setRows(DEMO_EMP_LIST);
    } catch {
      addToast("Using demo employee data", "info");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filters.department) list = list.filter((r) => r.department === filters.department);
    if (filters.employment_type) list = list.filter((r) => r.employment_type === filters.employment_type);
    if (filters.shift) list = list.filter((r) => r.shift === filters.shift);
    return list;
  }, [rows, filters]);

  const handleChange = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_code || !form.full_name) {
      setError("Employee code and full name are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createEmployee({
        ...form,
        tenant_id: tenantId,
        hire_date: form.hire_date || null,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        salary: form.salary ? Number(form.salary) : null,
      });
      addToast("Employee created successfully", "success");
      setShowCreateModal(false);
      // Reset form
      setForm({
        tenant_id: tenantId,
        employee_code: "",
        full_name: "",
        email: "",
        department: "Production",
        designation: "Technician",
        shift_name: "General",
        reporting_manager: "",
        employment_type: "permanent",
        phone: "",
        salary: "",
        hire_date: new Date().toISOString().slice(0, 10),
        hourly_rate: "150",
      });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create employee.");
      addToast("Failed to create employee", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "photo", label: "Photo", render: (r) => (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">{r.initials || "?"}</div>
    )},
    { key: "employee_id", label: "Employee ID" },
    { key: "full_name", label: "Name", render: (r) => <span className="font-medium text-slate-900">{r.full_name}</span> },
    { key: "department", label: "Department", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${deptColor(r.department)}`}>{r.department}</span> },
    { key: "designation", label: "Designation" },
    { key: "shift", label: "Shift" },
    { key: "reporting_manager", label: "Manager", render: (r) => r.reporting_manager || "—" },
    { key: "employment_type", label: "Type", render: (r) => <span className="capitalize">{r.employment_type}</span> },
    { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span> },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "joining_date", label: "Joining", render: (r) => String(r.joining_date || "").slice(0, 10) || "—" },
    { key: "salary", label: "Salary", render: (r) => r.salary ? formatInr(r.salary) : "—" },
    { key: "actions", label: "Actions", sortable: false, render: (r) => (
      <RowActionMenu
        rowId={r.id}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        items={[
          { label: "View Profile", icon: <Eye className="h-4 w-4" />, onClick: () => setSelected(r) },
        ]}
      />
    )},
  ];

  if (loading) return <Loader label="Loading employees..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="mt-1 text-sm text-slate-500">Enterprise employee management with 360° profile, shift, and payroll integration.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="ui-btn-primary inline-flex items-center gap-1.5 animate-none"
          >
            <Plus className="h-4 w-4" /> Create Employee
          </button>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Total Employees" value={summary.total_employees} icon={Users} color="bg-blue-600" />
        <KpiCard label="Present Today" value={summary.present_today} icon={UserCheck} color="bg-green-600" />
        <KpiCard label="Absent" value={summary.absent} icon={UserMinus} color="bg-red-500" />
        <KpiCard label="On Leave" value={summary.on_leave} icon={Briefcase} color="bg-amber-500" />
        <KpiCard label="Overtime (h)" value={summary.overtime} icon={Briefcase} color="bg-orange-500" />
        <KpiCard label="Departments" value={summary.departments} icon={Users} color="bg-indigo-600" />
        <KpiCard label="Contract" value={summary.contract_employees} icon={Users} color="bg-teal-600" />
        <KpiCard label="New Joiners" value={summary.new_joiners} icon={UserPlus} color="bg-purple-600" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Filter className="h-4 w-4" /> Filters</button>
        {showAdvanced && (
          <div className="mb-4 grid gap-3 sm:grid-cols-3 animate-in slide-in-from-top duration-150">
            <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All Departments</option>
              {["Production", "Quality", "Maintenance", "Stores", "HR"].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filters.employment_type} onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All Types</option>
              {["permanent", "contract", "temporary"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filters.shift} onChange={(e) => setFilters({ ...filters, shift: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">All Shifts</option>
              {["Morning", "General", "Evening", "Night"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <DataTable columns={columns} data={filtered} searchPlaceholder="Search employee, department..." searchKeys={["full_name", "employee_id", "department", "designation"]} />
      </div>

      {selected && <EmployeeDetailModal employee={selected} onClose={() => setSelected(null)} />}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Employee</h3>
                <p className="text-xs text-slate-500 mt-0.5">Add a new employee entry with contact, designation, and pay details.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP001"
                    value={form.employee_code}
                    onChange={(e) => handleChange("employee_code", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sowmya"
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    placeholder="sowmya@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {["Production", "Quality", "Maintenance", "Stores", "HR"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</label>
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Shift Name</label>
                  <select
                    value={form.shift_name}
                    onChange={(e) => handleChange("shift_name", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {["Morning", "General", "Evening", "Night"].map((s) => (
                      <option key={s} value={s}>{s} Shift</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Employment Type</label>
                  <select
                    value={form.employment_type}
                    onChange={(e) => handleChange("employment_type", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {["permanent", "contract", "temporary"].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Reporting Manager</label>
                  <input
                    type="text"
                    value={form.reporting_manager}
                    onChange={(e) => handleChange("reporting_manager", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Hire Date</label>
                  <input
                    type="date"
                    value={form.hire_date}
                    onChange={(e) => handleChange("hire_date", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={form.hourly_rate}
                    onChange={(e) => handleChange("hourly_rate", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Salary (₹ / month)</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={(e) => handleChange("salary", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
