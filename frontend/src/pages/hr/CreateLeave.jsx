import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

import { createLeaveRequest, getEmployees } from "../../api/hrApi";

const LEAVE_TYPES = ["casual", "sick", "annual", "unpaid"];

export default function CreateLeave() {
  const navigate = useNavigate();
=======
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { createLeaveRequest, getEmployees } from "../../api/hrApi";
import { useToast } from "../../context/ToastContext";

const LEAVE_TYPES = ["casual", "sick", "annual", "unpaid"];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

export default function CreateLeave() {
  const navigate = useNavigate();
  const { addToast } = useToast();
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    leave_type: "casual",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
<<<<<<< HEAD
    getEmployees().then((r) => setEmployees(r.data || [])).catch(console.error);
=======
    getEmployees()
      .then((r) => setEmployees(r.data || []))
      .catch(console.error);
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.start_date || !form.end_date) {
<<<<<<< HEAD
      setError("Select employee and date range.");
=======
      setError("Please fill in all required fields.");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createLeaveRequest({
        employee_id: Number(form.employee_id),
        leave_type: form.leave_type,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason.trim() || null,
        status: "pending",
      });
<<<<<<< HEAD
      navigate("/hr/leave");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit leave request.");
=======
      addToast("Leave request submitted successfully", "success");
      navigate("/hr/leave");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit leave request.");
      addToast("Failed to submit leave request", "error");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    } finally {
      setSaving(false);
    }
  };

  return (
<<<<<<< HEAD
    <div style={{ maxWidth: "640px" }}>
      <h2>Request Leave</h2>
      {error && (
        <p style={{ color: "#dc2626", marginTop: "12px" }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        <label>
          Employee
=======
    <div className="mx-auto max-w-lg space-y-6 p-4 sm:p-6">
      <div>
        <Link
          to="/hr/leave"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leave Management
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Request Leave</h1>
        <p className="mt-1 text-sm text-slate-500">Submit a new leave request workflow for approval.</p>
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
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <select
            value={form.employee_id}
            onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
            required
<<<<<<< HEAD
            style={{ display: "block", width: "100%", marginTop: "4px", padding: "8px" }}
=======
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} ({emp.employee_code})
              </option>
            ))}
          </select>
<<<<<<< HEAD
        </label>
        <label>
          Leave type
          <select
            value={form.leave_type}
            onChange={(e) => setForm((f) => ({ ...f, leave_type: e.target.value }))}
            style={{ display: "block", width: "100%", marginTop: "4px", padding: "8px" }}
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start date
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
            required
            style={{ display: "block", width: "100%", marginTop: "4px", padding: "8px" }}
          />
        </label>
        <label>
          End date
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
            required
            style={{ display: "block", width: "100%", marginTop: "4px", padding: "8px" }}
          />
        </label>
        <label>
          Reason
=======
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Leave Type *</label>
          <select
            value={form.leave_type}
            onChange={(e) => setForm((f) => ({ ...f, leave_type: e.target.value }))}
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)} Leave
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date *</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date *</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason for Leave</label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
<<<<<<< HEAD
            style={{ display: "block", width: "100%", marginTop: "4px", padding: "8px" }}
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Submitting..." : "Submit Request"}
        </button>
=======
            placeholder="Please specify the reason for your leave request..."
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Link
            to="/hr/leave"
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
            {saving ? "Submitting..." : "Submit Request"}
          </button>
        </div>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </form>
    </div>
  );
}
