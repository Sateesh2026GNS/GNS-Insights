import { useState } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { createEmployee } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";

const inputClass = "ui-input mt-1.5";
=======
import { useNavigate } from "react-router-dom";

import { createEmployee } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";


>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

export default function CreateEmployee() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenant_id: tenantId,
    employee_code: "",
    full_name: "",
    email: "",
    department: "",
    hire_date: "",
    hourly_rate: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

<<<<<<< HEAD
  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };

=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createEmployee({
        ...form,
        tenant_id: tenantId,
<<<<<<< HEAD
        employee_code: form.employee_code.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim() || null,
        department: form.department.trim() || null,
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        hire_date: form.hire_date || null,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      });
      navigate("/hr/employees");
    } catch (err) {
<<<<<<< HEAD
      const detail = err?.response?.data?.detail || err?.response?.data?.message;
      setError(
        typeof detail === "string"
          ? detail
          : "Failed to create employee. Please check the form and try again."
      );
=======
      setError(err.response?.data?.detail || "Failed to create employee.");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    } finally {
      setSaving(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <Link
        to="/hr/employees"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to employees
      </Link>

      <PageHeader
        title="Create Employee"
        subtitle="Add a new employee record for attendance, leave, and payroll."
      />

      <form onSubmit={handleSubmit} className="ui-card space-y-5 p-6 sm:p-8">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 sm:col-span-1">
            Employee Code <span className="text-red-500">*</span>
            <input
              type="text"
              value={form.employee_code}
              onChange={setField("employee_code")}
              placeholder="e.g. EMP-001"
              required
              autoComplete="off"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 sm:col-span-1">
            Full Name <span className="text-red-500">*</span>
            <input
              type="text"
              value={form.full_name}
              onChange={setField("full_name")}
              placeholder="e.g. Priya Sharma"
              required
              autoComplete="name"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
            Email
            <input
              type="email"
              value={form.email}
              onChange={setField("email")}
              placeholder="name@company.com"
              autoComplete="email"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Department
            <input
              type="text"
              value={form.department}
              onChange={setField("department")}
              placeholder="e.g. Production"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Hire Date
            <input
              type="date"
              value={form.hire_date}
              onChange={setField("hire_date")}
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
            Hourly Rate ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.hourly_rate}
              onChange={setField("hourly_rate")}
              placeholder="0.00"
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <button type="submit" disabled={saving} className="ui-btn-primary disabled:opacity-50">
            {saving ? "Creating…" : "Create Employee"}
          </button>
          <Link to="/hr/employees" className="ui-btn-secondary">
            Cancel
          </Link>
=======
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create Employee</h2>
        <p className="mt-1 text-sm text-slate-500">Add a new employee entry with contact, department, and pay details.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Employee Code</span>
            <input
              type="text"
              value={form.employee_code}
              onChange={(e) => setForm((f) => ({ ...f, employee_code: e.target.value }))}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="e.g. EMP001"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Full Name</span>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="e.g. John Doe"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="john@example.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Department</span>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="e.g. HR"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Hire Date</span>
            <input
              type="date"
              value={form.hire_date}
              onChange={(e) => setForm((f) => ({ ...f, hire_date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#2563EB] focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-1 block">Hourly Rate ($)</span>
            <input
              type="number"
              step="0.01"
              value={form.hourly_rate}
              onChange={(e) => setForm((f) => ({ ...f, hourly_rate: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="e.g. 15"
            />
          </label>
        </div>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="flex justify-end gap-2 border-t pt-4">
          <button type="button" onClick={() => navigate("/hr/employees")} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Create Employee"}</button>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>
      </form>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
