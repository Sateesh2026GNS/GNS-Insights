import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
<<<<<<< HEAD
import { createSupplier } from "../../api/inventoryApi";
=======
import { createVendor } from "../../api/procurementApi";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
import useTenantId from "../../hooks/useTenantId";



const inputClass =
<<<<<<< HEAD
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";
=======
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

export default function CreateVendor() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenant_id: tenantId,
    name: "",
    contact: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
<<<<<<< HEAD
      await createSupplier({ ...form, approval_status: "pending" });
      navigate("/procurement/vendors");
=======
      await createVendor({ ...form, approval_status: "pending" });
      navigate("/vendors");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to create vendor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
<<<<<<< HEAD
        to="/procurement/vendors"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
=======
        to="/vendors"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      >
        <ArrowLeft className="h-4 w-4" />
        Back to vendors
      </Link>
      <PageHeader
        title="Create vendor"
        subtitle="Add a new vendor to link with purchase orders and payments."
      />
<<<<<<< HEAD
      <form onSubmit={handleSubmit} className="ui-card space-y-4 p-6">
=======
      <form onSubmit={handleSubmit} className="ui-card space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}
<<<<<<< HEAD
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Name *
=======
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase">Vendor Name *</label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="e.g. Acme Supplies"
            className={inputClass}
          />
<<<<<<< HEAD
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Contact person
          <input
            type="text"
            value={form.contact}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            placeholder="e.g. John Smith"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
=======
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">Contact person</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="e.g. John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">Mobile</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +91 98765 43210"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase">Email</label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="e.g. contact@vendor.com"
            className={inputClass}
          />
<<<<<<< HEAD
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Phone
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="e.g. +1 234 567 8900"
            className={inputClass}
          />
        </label>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" disabled={saving} className="ui-btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Create vendor"}
          </button>
          <Link
            to="/procurement/vendors"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
=======
        </div>
        <div className="flex flex-wrap gap-3 pt-4 border-t justify-end">
          <Link
            to="/vendors"
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving…" : "Create vendor"}
          </button>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>
      </form>
    </div>
  );
}