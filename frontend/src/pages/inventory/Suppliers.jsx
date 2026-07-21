import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
=======
import { useTranslation } from "react-i18next";
import { Plus, XCircle } from "lucide-react";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
<<<<<<< HEAD
import { getSuppliers } from "../../api/inventoryApi";
import useTenantId from "../../hooks/useTenantId";

=======
import { createVendor, getVendors } from "../../api/procurementApi";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


export default function Suppliers() {
  const tenantId = useTenantId();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [loadError, setLoadError] = useState("");
<<<<<<< HEAD

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await getSuppliers(tenantId);
        setSuppliers(res.data || []);
      } catch (e) {
        setLoadError("Could not load suppliers. Is the API running?");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
=======
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");
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

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getVendors();
      const payload = res?.data ?? [];
      const normalized = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.results)
            ? payload.results
            : [];
      setSuppliers(normalized.filter((item) => item && typeof item === "object"));
    } catch (e) {
      setLoadError("Could not load suppliers. Is the API running?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tenantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");
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
      setShowCreate(false);
      setForm({
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
      await load();
    } catch (err) {
      setCreateError(err.response?.data?.detail || err.message || "Failed to create supplier.");
    } finally {
      setSaving(false);
    }
  };
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

  if (loading) return <Loader label="Loading suppliers..." />;

  const columns = [
<<<<<<< HEAD
    { key: "name", label: "NAME" },
    { key: "contact", label: "CONTACT", render: (r) => r.contact ?? "—" },
    { key: "email", label: "EMAIL", render: (r) => r.email ?? "—" },
    { key: "phone", label: "PHONE", render: (r) => r.phone ?? "—" },
=======
    { key: "name", label: "NAME", render: (r) => r.name || "—" },
    { key: "vendor_code", label: "CODE", render: (r) => r.vendor_code || "—" },
    { key: "contact", label: "CONTACT", render: (r) => r.contact || "—" },
    { key: "email", label: "EMAIL", render: (r) => r.email || "—" },
    { key: "phone", label: "PHONE", render: (r) => r.phone || "—" },
    { key: "city", label: "CITY", render: (r) => r.city || "—" },
    { key: "category", label: "CATEGORY", render: (r) => r.category || "—" },
    { key: "status", label: "STATUS", render: (r) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        r.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
      }`}>{r.status || "active"}</span>
    )},
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  ];

  const emptyState = (
    <EmptyState
      icon="clipboard"
      title="No suppliers yet"
      description="Create your first supplier to link materials and purchase orders."
      actionLabel="Create supplier"
<<<<<<< HEAD
      actionHref="/inventory/suppliers/create"
=======
      onActionClick={() => {
        setCreateError("");
        setShowCreate(true);
      }}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    />
  );

  const createAction = (
<<<<<<< HEAD
    <Link to="/inventory/suppliers/create" className="ui-btn-primary">
      <Plus className="h-4 w-4" />
      Create supplier
    </Link>
  );

  return (
    <div className="space-y-6">
=======
    <button
      type="button"
      onClick={() => {
        setCreateError("");
        setShowCreate(true);
      }}
      className="ui-btn-primary inline-flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Create supplier
    </button>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      <PageHeader
        title="Supplier Tracking"
        subtitle="View and manage your suppliers. Link them to materials and purchase orders."
        action={createAction}
      />
      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100">
          {loadError}
        </div>
      )}
<<<<<<< HEAD
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
=======
      <div className="ui-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        <DataTable
          columns={columns}
          data={suppliers}
          searchPlaceholder={t("common.search")}
          searchKeys={["name", "contact", "email", "phone"]}
          emptyState={emptyState}
        />
      </div>
<<<<<<< HEAD
=======

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="ui-card flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create New Supplier</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add supplier details for procurement and payment tracking.</p>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
              {createError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                  {typeof createError === "string" ? createError : JSON.stringify(createError)}
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
              <div className="grid gap-3 md:grid-cols-2">
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
              <div className="grid gap-3 md:grid-cols-2">
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
              <div className="grid gap-3 md:grid-cols-2">
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
              <div className="grid gap-3 md:grid-cols-2">
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
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm">
                  {saving ? "Saving…" : "Create supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    </div>
  );
}