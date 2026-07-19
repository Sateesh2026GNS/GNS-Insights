import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, IndianRupee, Plus, RefreshCw, X, Save } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import RowActionMenu from "../../components/common/RowActionMenu";
import Loader from "../../components/common/Loader";
import PayrollDetailModal from "../../components/hr/PayrollDetailModal";
import { useToast } from "../../context/ToastContext";
import { getPayrollEnriched, getPayrollSummary, getEmployees, createPayroll } from "../../api/hrApi";
import { DEMO_PAY_LIST, DEMO_PAY_SUMMARY, formatInr, statusColor } from "../../data/hrMasterData";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

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

export default function Payroll() {
  const tenantId = useTenantId();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(DEMO_PAY_SUMMARY);
  const [rows, setRows] = useState(DEMO_PAY_LIST);
  const [selected, setSelected] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // Modal form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    tenant_id: tenantId,
    employee_id: "",
    period_start: new Date().toISOString().slice(0, 10),
    period_end: new Date().toISOString().slice(0, 10),
    basic: "25000",
    allowance: "5000",
    bonus: "0",
    overtime_pay: "0",
    tax: "0",
    pf: "0",
    esi: "0",
    regular_hours: "160",
    overtime_hours: "0",
    regular_pay: "0",
    gross_pay: "0",
    deductions: "0",
    net_pay: "0",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, listRes, empRes] = await Promise.allSettled([
        getPayrollSummary(),
        getPayrollEnriched(),
        getEmployees(),
      ]);
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary({ ...DEMO_PAY_SUMMARY, ...sumRes.value.data });
      if (listRes.status === "fulfilled" && listRes.value?.data?.length) setRows(listRes.value.data);
      else setRows(DEMO_PAY_LIST);
      if (empRes.status === "fulfilled") setEmployees(empRes.value?.data || []);
    } catch {
      addToast("Using demo payroll data", "info");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  // Auto-calculate Gross Pay and Net Pay (PF, ESI, Tax)
  useEffect(() => {
    const basicVal = parseFloat(form.basic) || 0;
    const allowanceVal = parseFloat(form.allowance) || 0;
    const bonusVal = parseFloat(form.bonus) || 0;
    const otPayVal = parseFloat(form.overtime_pay) || 0;
    const taxVal = parseFloat(form.tax) || 0;

    const pfVal = Math.round(basicVal * 0.12 * 100) / 100;
    const esiVal = Math.round(basicVal * 0.0075 * 100) / 100;

    const gross = basicVal + allowanceVal + otPayVal + bonusVal;
    const ded = pfVal + esiVal + taxVal;
    const net = Math.max(0, gross - ded);

    setForm((f) => {
      if (
        parseFloat(f.pf) === pfVal &&
        parseFloat(f.esi) === esiVal &&
        parseFloat(f.regular_pay) === basicVal &&
        parseFloat(f.gross_pay) === gross &&
        parseFloat(f.deductions) === ded &&
        parseFloat(f.net_pay) === net
      ) {
        return f;
      }
      return {
        ...f,
        pf: String(pfVal),
        esi: String(esiVal),
        regular_pay: String(basicVal),
        gross_pay: String(gross),
        deductions: String(ded),
        net_pay: String(net),
      };
    });
  }, [form.basic, form.allowance, form.bonus, form.overtime_pay, form.tax]);

  const handleChange = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.period_start || !form.period_end) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createPayroll({
        ...form,
        employee_id: Number(form.employee_id),
        regular_hours: Number(form.regular_hours) || 0,
        overtime_hours: Number(form.overtime_hours) || 0,
        regular_pay: Number(form.basic) || 0,
        basic: Number(form.basic) || 0,
        allowance: Number(form.allowance) || 0,
        bonus: Number(form.bonus) || 0,
        overtime_pay: Number(form.overtime_pay) || 0,
        pf: Number(form.pf) || 0,
        esi: Number(form.esi) || 0,
        tax: Number(form.tax) || 0,
        gross_pay: Number(form.gross_pay) || 0,
        deductions: Number(form.deductions) || 0,
        net_pay: Number(form.net_pay) || 0,
      });
      addToast("Payroll record created successfully", "success");
      setShowCreateModal(false);
      // Reset form
      setForm({
        tenant_id: tenantId,
        employee_id: "",
        period_start: new Date().toISOString().slice(0, 10),
        period_end: new Date().toISOString().slice(0, 10),
        basic: "25000",
        allowance: "5000",
        bonus: "0",
        overtime_pay: "0",
        tax: "0",
        pf: "0",
        esi: "0",
        regular_hours: "160",
        overtime_hours: "0",
        regular_pay: "0",
        gross_pay: "0",
        deductions: "0",
        net_pay: "0",
        status: "draft",
      });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create payroll record.");
      addToast("Failed to create payroll record", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "employee_name", label: "Employee" },
    { key: "basic", label: "Basic", render: (r) => formatInr(r.basic) },
    { key: "allowance", label: "Allowance", render: (r) => formatInr(r.allowance) },
    { key: "overtime", label: "OT", render: (r) => formatInr(r.overtime) },
    { key: "bonus", label: "Bonus", render: (r) => formatInr(r.bonus) },
    { key: "pf", label: "PF", render: (r) => formatInr(r.pf) },
    { key: "esi", label: "ESI", render: (r) => formatInr(r.esi) },
    { key: "tax", label: "Tax", render: (r) => formatInr(r.tax) },
    { key: "net_salary", label: "Net Salary", render: (r) => <span className="font-semibold">{formatInr(r.net_salary)}</span> },
    { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span> },
    { key: "actions", label: "Actions", sortable: false, render: (r) => (
      <RowActionMenu
        rowId={r.id}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        items={[
          { label: "View Payslip", icon: <FileText className="h-4 w-4" />, onClick: () => setSelected(r) },
        ]}
      />
    )},
  ];

  if (loading && rows.length === 0) return <Loader label="Loading payroll register..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
          <p className="mt-1 text-sm text-slate-500">Enterprise payroll with PF, ESI, tax, overtime, and salary slip generation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="ui-btn-primary inline-flex items-center gap-1.5 animate-none"
          >
            <Plus className="h-4 w-4" /> Create Payroll
          </button>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        <KpiCard label="Monthly Payroll" value={formatInr(summary.monthly_payroll)} icon={IndianRupee} color="bg-blue-600" />
        <KpiCard label="Pending Salary" value={formatInr(summary.pending_salary)} icon={IndianRupee} color="bg-amber-500" />
        <KpiCard label="Processed" value={formatInr(summary.processed_salary)} icon={IndianRupee} color="bg-green-600" />
        <KpiCard label="OT Cost" value={formatInr(summary.overtime_cost)} icon={IndianRupee} color="bg-orange-500" />
        <KpiCard label="PF" value={formatInr(summary.pf)} icon={IndianRupee} color="bg-indigo-600" />
        <KpiCard label="ESI" value={formatInr(summary.esi)} icon={IndianRupee} color="bg-teal-600" />
        <KpiCard label="Prof. Tax" value={formatInr(summary.professional_tax)} icon={IndianRupee} color="bg-purple-600" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Payroll Register</h2>
          <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-[#2563EB]"><Download className="h-4 w-4" /> Export</button>
        </div>
        <DataTable columns={columns} data={rows} searchPlaceholder="Search employee name..." searchKeys={["employee_name"]} />
      </div>

      {selected && <PayrollDetailModal record={selected} onClose={() => setSelected(null)} />}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Payroll Record</h3>
                <p className="text-xs text-slate-500 mt-0.5">Record wages, hours, and deductions for an employee.</p>
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

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Employee *</label>
                <select
                  value={form.employee_id}
                  onChange={(e) => handleChange("employee_id", e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.full_name} ({e.employee_code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Period Start *</label>
                  <input
                    type="date"
                    required
                    value={form.period_start}
                    onChange={(e) => handleChange("period_start", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Period End *</label>
                  <input
                    type="date"
                    required
                    value={form.period_end}
                    onChange={(e) => handleChange("period_end", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Regular Hours Working</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.regular_hours}
                    onChange={(e) => handleChange("regular_hours", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Overtime Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.overtime_hours}
                    onChange={(e) => handleChange("overtime_hours", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Pay (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.basic}
                    onChange={(e) => handleChange("basic", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Overtime Pay (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.overtime_pay}
                    onChange={(e) => handleChange("overtime_pay", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Allowance (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.allowance}
                    onChange={(e) => handleChange("allowance", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bonus (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.bonus}
                    onChange={(e) => handleChange("bonus", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tax Deduction (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.tax}
                    onChange={(e) => handleChange("tax", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <hr className="my-2 border-slate-100" />

              <div className="grid grid-cols-5 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">PF (12%)</label>
                  <p className="mt-1 text-xs font-bold text-slate-800">₹{form.pf}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">ESI (0.75%)</label>
                  <p className="mt-1 text-xs font-bold text-slate-800">₹{form.esi}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Deductions</label>
                  <p className="mt-1 text-xs font-bold text-red-600">₹{form.deductions}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Gross Pay</label>
                  <p className="mt-1 text-xs font-bold text-slate-800">₹{form.gross_pay}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-blue-500 uppercase tracking-wider">Net Salary</label>
                  <p className="mt-1 text-xs font-bold text-blue-600">₹{form.net_pay}</p>
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
                  disabled={saving || !form.employee_id}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Creating..." : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
