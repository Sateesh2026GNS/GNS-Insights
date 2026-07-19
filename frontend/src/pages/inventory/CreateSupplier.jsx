import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { createVendor } from "../../api/procurementApi";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

export default function CreateSupplier() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenant_id: tenantId,
    name: "",
    contact: "",
    email: "",
    phone: "",
    vendor_code: "",
    gstin: "",
    city: "",
    state: "",
    country: "India",
    category: "",
    material_type: "",
    payment_terms: "",
    approval_status: "approved",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        tenant_id: tenantId,
        name: form.name.trim(),
        contact: form.contact.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        vendor_code: form.vendor_code.trim() || null,
        gstin: form.gstin.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        country: form.country.trim() || "India",
        category: form.category.trim() || null,
        material_type: form.material_type.trim() || null,
        payment_terms: form.payment_terms.trim() || null,
        approval_status: form.approval_status || "approved",
        status: form.status || "active",
      };
      await createVendor(payload);
      navigate("/inventory/suppliers");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to create supplier.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <Link
        to="/inventory/suppliers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to suppliers
      </Link>
      <PageHeader
        title="Create Supplier"
        subtitle="Add a new supplier to link with materials and purchase orders."
      />
      <form onSubmit={handleSubmit} className="ui-card space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}
        
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Supplier Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="e.g. Acme Materials"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Contact person</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="e.g. John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Mobile</label>
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
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="e.g. contact@supplier.com"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Vendor code</label>
            <input
              type="text"
              value={form.vendor_code}
              onChange={(e) => setForm((f) => ({ ...f, vendor_code: e.target.value }))}
              placeholder="e.g. VEN001"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">GSTIN</label>
            <input
              type="text"
              value={form.gstin}
              onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))}
              placeholder="e.g. 36AABCS1234A1Z1"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="e.g. Hyderabad"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              placeholder="e.g. Telangana"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Raw Material"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Material type</label>
            <input
              type="text"
              value={form.material_type}
              onChange={(e) => setForm((f) => ({ ...f, material_type: e.target.value }))}
              placeholder="e.g. Steel"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Payment terms</label>
          <input
            type="text"
            value={form.payment_terms}
            onChange={(e) => setForm((f) => ({ ...f, payment_terms: e.target.value }))}
            placeholder="e.g. Net 30"
            className={inputClass}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">
          <Link
            to="/inventory/suppliers"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm">
            {saving ? "Saving…" : "Create supplier"}
          </button>
        </div>
      </form>
    </div>
  );
}