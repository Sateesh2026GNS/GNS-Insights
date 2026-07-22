import { useCallback, useEffect, useState } from "react";
import { Download, IndianRupee, Plus, RefreshCw, X, Save } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import PayrollDetailModal from "../../components/hr/PayrollDetailModal";
import { useToast } from "../../context/ToastContext";
import { getPayrollEnriched, getPayrollSummary, createPayroll, getEmployeesEnriched } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";
import { DEMO_PAY_SUMMARY, formatInr, statusColor } from "../../data/hrMasterData";

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
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenant_id: tenantId,
    employee_id: "",
    period_start: new Date().toISOString().slice(0, 7) + "-01",
    period_end: new Date().toISOString().slice(0, 10),
    regular_hours: "160",
    overtime_hours: "0",
    regular_pay: "0",
    overtime_pay: "0",
    gross_pay: "0",
    pf: "0",
    esi: "0",
    tax: "0",
    deductions: "0",
    net_pay: "0",
    status: "draft",
  });

  const load = useCallback(async (isManual = false) => {
    setLoading(true);
    try {
      const [sumRes, listRes, empRes] = await Promise.allSettled([
        getPayrollSummary(),
        getPayrollEnriched(),
        getEmployeesEnriched()
      ]);
      let hasError = false;
      if (sumRes.status === "fulfilled" && sumRes.value?.data) {
        setSummary({ ...DEMO_PAY_SUMMARY, ...sumRes.value.data });
      } else if (sumRes.status === "rejected") {
        hasError = true;
      }

      if (listRes.status === "fulfilled" && Array.isArray(listRes.value?.data)) {
        setRows(listRes.value.data);
      } else if (listRes.status === "rejected") {
        hasError = true;
      }

      if (empRes.status === "fulfilled" && Array.isArray(empRes.value?.data)) {
        setEmployees(empRes.value.data);
      }

      if (isManual) {
        if (hasError) addToast("Failed to refresh payroll data", "error");
        else addToast("Payroll data refreshed", "success");
      }
    } catch {
      if (isManual) addToast("Failed to refresh payroll data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto compute pay and deduction breakdown values
      const regPay = Number(field === "regular_pay" ? value : prev.regular_pay) || 0;
      const otPay = Number(field === "overtime_pay" ? value : prev.overtime_pay) || 0;
      
      const pf = Number(field === "pf" ? value : prev.pf) || 0;
      const esi = Number(field === "esi" ? value : prev.esi) || 0;
      const tax = Number(field === "tax" ? value : prev.tax) || 0;
      
      const gross = regPay + otPay;
      const totalDeductions = pf + esi + tax;
      const net = Math.max(0, gross - totalDeductions);

      updated.gross_pay = String(gross);
      updated.deductions = String(totalDeductions);
      updated.net_pay = String(net);
      
      return updated;
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.period_start || !form.period_end) {
      setError("Please fill all required fields.");
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
        regular_pay: Number(form.regular_pay) || 0,
        basic: Number(form.regular_pay) || 0,
        overtime_pay: Number(form.overtime_pay) || 0,
        gross_pay: Number(form.gross_pay) || 0,
        pf: Number(form.pf) || 0,
        esi: Number(form.esi) || 0,
        tax: Number(form.tax) || 0,
        deductions: Number(form.deductions) || 0,
        net_pay: Number(form.net_pay) || 0,
      });
      addToast("Payroll record created successfully", "success");
      setShowCreateModal(false);
      setForm({
        tenant_id: tenantId,
        employee_id: "",
        period_start: new Date().toISOString().slice(0, 7) + "-01",
        period_end: new Date().toISOString().slice(0, 10),
        regular_hours: "160",
        overtime_hours: "0",
        regular_pay: "0",
        overtime_pay: "0",
        gross_pay: "0",
        pf: "0",
        esi: "0",
        tax: "0",
        deductions: "0",
        net_pay: "0",
        status: "draft",
      });
      load();
    } catch (err) {
      setError("Failed to create payroll record.");
      addToast("Failed to create payroll", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "employee_name", label: "Employee" },
    { key: "basic", label: "Regular Pay", render: (r) => formatInr(r.basic || r.regular_pay) },
    { key: "overtime", label: "OT Pay", render: (r) => formatInr(r.overtime || r.overtime_pay) },
    { key: "gross_pay", label: "Gross Pay", render: (r) => formatInr(r.gross_pay) },
    { key: "pf", label: "PF", render: (r) => formatInr(r.pf) },
    { key: "esi", label: "ESI", render: (r) => formatInr(r.esi) },
    { key: "tax", label: "Tax", render: (r) => formatInr(r.tax) },
    { key: "deductions", label: "Total Deductions", render: (r) => <span className="text-red-600 font-medium">{formatInr(r.deductions)}</span> },
    { key: "net_salary", label: "Net Salary", render: (r) => <span className="font-bold text-emerald-700">{formatInr(r.net_salary || r.net_pay)}</span> },
    { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span> },
    { key: "actions", label: "Actions", render: (r) => (
      <button type="button" onClick={() => setSelected(r)} className="text-xs font-semibold text-[#2563EB] hover:underline">Payslip</button>
    )},
  ];

  const handleExport = () => {
    if (!rows || rows.length === 0) {
      addToast("No payroll records available to export", "error");
      return;
    }
    const headers = ["Employee", "Period Start", "Period End", "Regular Pay", "OT Pay", "Gross Pay", "PF", "ESI", "Tax", "Total Deductions", "Net Salary", "Status"];
    const csvLines = [
      headers.join(","),
      ...rows.map((r) => [
        `"${r.employee_name || ''}"`,
        `"${r.period_start || ''}"`,
        `"${r.period_end || ''}"`,
        r.basic || r.regular_pay || 0,
        r.overtime || r.overtime_pay || 0,
        r.gross_pay || 0,
        r.pf || 0,
        r.esi || 0,
        r.tax || 0,
        r.deductions || 0,
        r.net_salary || r.net_pay || 0,
        `"${r.status || ''}"`
      ].join(","))
    ];

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Payroll_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Payroll register exported to CSV", "success");
  };

  if (loading && rows.length === 0) return <Loader label="Loading payroll..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Payroll</h1>
          <p className="mt-1 text-sm text-slate-500">Enterprise payroll with PF, ESI, tax, overtime, and salary slip generation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Create Payroll
          </button>
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
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
          <h2 className="font-semibold text-slate-900 font-sans">Payroll Register</h2>
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-[#2563EB]"><Download className="h-4 w-4" /> Export</button>
        </div>
        <DataTable columns={columns} data={rows} searchPlaceholder="Search employee..." searchKeys={["employee_name", "status"]} />
      </div>

      {selected && <PayrollDetailModal record={selected} onClose={() => setSelected(null)} />}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Payroll Record</h3>
                <p className="text-xs text-slate-500 mt-0.5">Generate a new monthly payroll details entry.</p>
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
                  onChange={(e) => handleFormChange("employee_id", e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.full_name}</option>
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
                    onChange={(e) => handleFormChange("period_start", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Period End *</label>
                  <input
                    type="date"
                    required
                    value={form.period_end}
                    onChange={(e) => handleFormChange("period_end", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Regular Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.regular_hours}
                    onChange={(e) => handleFormChange("regular_hours", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Overtime Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.overtime_hours}
                    onChange={(e) => handleFormChange("overtime_hours", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Regular Pay (₹)</label>
                  <input
                    type="number"
                    value={form.regular_pay}
                    onChange={(e) => handleFormChange("regular_pay", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Overtime Pay (₹)</label>
                  <input
                    type="number"
                    value={form.overtime_pay}
                    onChange={(e) => handleFormChange("overtime_pay", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Deductions Breakdown: PF, ESI, Tax */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-3">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Deductions Breakdown</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500">PF (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={form.pf}
                      onChange={(e) => handleFormChange("pf", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">ESI (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={form.esi}
                      onChange={(e) => handleFormChange("esi", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500">Tax / TDS (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={form.tax}
                      onChange={(e) => handleFormChange("tax", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Summary: Gross Pay, Total Deductions, Net Pay */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Pay (₹)</label>
                  <input
                    type="number"
                    disabled
                    value={form.gross_pay}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-700 font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Total Deductions (₹)</label>
                  <input
                    type="number"
                    disabled
                    value={form.deductions}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-red-600 font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Net Pay (₹)</label>
                  <input
                    type="number"
                    disabled
                    value={form.net_pay}
                    className="mt-1.5 w-full rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 font-bold focus:outline-none"
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Create Payroll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
