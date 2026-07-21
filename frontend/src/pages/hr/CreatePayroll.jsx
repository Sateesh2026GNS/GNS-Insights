import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

import { createPayroll, getEmployees } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";


=======
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { createPayroll, getEmployees } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";
import { useToast } from "../../context/ToastContext";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

export default function CreatePayroll() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const { addToast } = useToast();
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    tenant_id: tenantId,
    employee_id: "",
    period_start: "",
    period_end: "",
<<<<<<< HEAD
    regular_hours: "0",
=======
    regular_hours: "160",
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    overtime_hours: "0",
    regular_pay: "0",
    overtime_pay: "0",
    gross_pay: "0",
    deductions: "0",
    net_pay: "0",
    status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
<<<<<<< HEAD
    getEmployees(tenantId).then((r) => setEmployees(r.data || [])).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
=======
    getEmployees(tenantId)
      .then((r) => setEmployees(r.data || []))
      .catch(console.error);
  }, [tenantId]);

  // Auto-calculate Gross Pay and Net Pay
  useEffect(() => {
    const regPay = parseFloat(form.regular_pay) || 0;
    const otPay = parseFloat(form.overtime_pay) || 0;
    const ded = parseFloat(form.deductions) || 0;

    const gross = regPay + otPay;
    const net = Math.max(0, gross - ded);

    setForm((f) => {
      if (parseFloat(f.gross_pay) === gross && parseFloat(f.net_pay) === net) {
        return f;
      }
      return {
        ...f,
        gross_pay: String(gross),
        net_pay: String(net),
      };
    });
  }, [form.regular_pay, form.overtime_pay, form.deductions]);

  const handleChange = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.period_start || !form.period_end) {
      setError("Please fill in all required fields.");
      return;
    }
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    setSaving(true);
    setError("");
    try {
      await createPayroll({
        ...form,
        employee_id: Number(form.employee_id),
        regular_hours: Number(form.regular_hours) || 0,
        overtime_hours: Number(form.overtime_hours) || 0,
        regular_pay: Number(form.regular_pay) || 0,
        overtime_pay: Number(form.overtime_pay) || 0,
        gross_pay: Number(form.gross_pay) || 0,
        deductions: Number(form.deductions) || 0,
        net_pay: Number(form.net_pay) || 0,
      });
<<<<<<< HEAD
      navigate("/hr/payroll");
    } catch (err) {
      setError("Failed to create payroll record.");
=======
      addToast("Payroll record created successfully", "success");
      navigate("/hr/payroll");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create payroll record.");
      addToast("Failed to create payroll record", "error");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    } finally {
      setSaving(false);
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ maxWidth: "640px" }}>
      <h2>Create Payroll Record</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        <label>
          Employee
          <select
            value={form.employee_id}
            onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
            required
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          >
            <option value="">Select</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.full_name}</option>
            ))}
          </select>
        </label>
        <label>
          Period Start
          <input
            type="date"
            value={form.period_start}
            onChange={(e) => setForm((f) => ({ ...f, period_start: e.target.value }))}
            required
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        <label>
          Period End
          <input
            type="date"
            value={form.period_end}
            onChange={(e) => setForm((f) => ({ ...f, period_end: e.target.value }))}
            required
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        <label>
          Regular Hours
          <input
            type="number"
            step="0.5"
            value={form.regular_hours}
            onChange={(e) => setForm((f) => ({ ...f, regular_hours: e.target.value }))}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        <label>
          Overtime Hours
          <input
            type="number"
            step="0.5"
            value={form.overtime_hours}
            onChange={(e) => setForm((f) => ({ ...f, overtime_hours: e.target.value }))}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        <label>
          Gross Pay ($)
          <input
            type="number"
            step="0.01"
            value={form.gross_pay}
            onChange={(e) => setForm((f) => ({ ...f, gross_pay: e.target.value }))}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        <label>
          Deductions ($)
          <input
            type="number"
            step="0.01"
            value={form.deductions}
            onChange={(e) => setForm((f) => ({ ...f, deductions: e.target.value }))}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        <label>
          Net Pay ($)
          <input
            type="number"
            step="0.01"
            value={form.net_pay}
            onChange={(e) => setForm((f) => ({ ...f, net_pay: e.target.value }))}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />
        </label>
        {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 16px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Create"}
        </button>
=======
    <div className="mx-auto max-w-xl space-y-6 p-4 sm:p-6">
      <div>
        <Link
          to="/hr/payroll"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Payroll
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Create Payroll Record</h1>
        <p className="mt-1 text-sm text-slate-500">Record wages, working hours, and deductions for an employee.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee *</label>
          <select
            value={form.employee_id}
            onChange={(e) => handleChange("employee_id", e.target.value)}
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name} ({e.employee_code})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Period Start *</label>
            <input
              type="date"
              value={form.period_start}
              onChange={(e) => handleChange("period_start", e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Period End *</label>
            <input
              type="date"
              value={form.period_end}
              onChange={(e) => handleChange("period_end", e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Regular Hours</label>
            <input
              type="number"
              step="0.5"
              value={form.regular_hours}
              onChange={(e) => handleChange("regular_hours", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Overtime Hours</label>
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
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Regular Pay (₹) *</label>
            <input
              type="number"
              step="0.01"
              value={form.regular_pay}
              onChange={(e) => handleChange("regular_pay", e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Overtime Pay (₹)</label>
            <input
              type="number"
              step="0.01"
              value={form.overtime_pay}
              onChange={(e) => handleChange("overtime_pay", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <hr className="my-2 border-slate-100" />

        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Pay (₹)</label>
            <input
              type="number"
              readOnly
              value={form.gross_pay}
              className="mt-1 w-full bg-transparent border-0 p-0 text-sm font-bold text-slate-800 focus:ring-0 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deductions (₹)</label>
            <input
              type="number"
              step="0.01"
              value={form.deductions}
              onChange={(e) => handleChange("deductions", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-wider">Net Pay (₹)</label>
            <input
              type="number"
              readOnly
              value={form.net_pay}
              className="mt-1 w-full bg-transparent border-0 p-0 text-sm font-bold text-blue-600 focus:ring-0 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Link
            to="/hr/payroll"
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.employee_id}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Save className="h-4 w-4" />
            {saving ? "Creating..." : "Create Record"}
          </button>
        </div>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </form>
    </div>
  );
}