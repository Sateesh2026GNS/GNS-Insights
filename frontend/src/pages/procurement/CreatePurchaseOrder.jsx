import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import { getVendors, createPurchaseOrder } from "../../api/procurementApi";

const TENANT_ID = 1;

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenant_id: TENANT_ID,
    supplier_id: "",
    po_number: "",
    order_date: new Date().toISOString().slice(0, 10),
    expected_date: "",
    status: "draft",
    total_amount: "",
    notes: "",
  });

  useEffect(() => {
    getVendors(TENANT_ID)
      .then((r) => setVendors(r.data || []))
      .catch(() => setError("Could not load suppliers."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createPurchaseOrder({
        tenant_id: TENANT_ID,
        supplier_id: Number(form.supplier_id),
        po_number: form.po_number || `PO-${Date.now()}`,
        order_date: form.order_date,
        expected_date: form.expected_date || null,
        status: form.status,
        total_amount: form.total_amount ? Number(form.total_amount) : null,
        notes: form.notes || null,
        line_items: [],
      });
      navigate("/procurement/purchase-orders");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading suppliers..." />;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        to="/procurement/purchase-orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to purchase orders
      </Link>
      <PageHeader
        title="New purchase order"
        subtitle="Create a PO in a few steps. You can add line items later if needed."
      />
      <form onSubmit={handleSubmit} className="ui-card space-y-4 p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Supplier *
          <select
            required
            value={form.supplier_id}
            onChange={(e) => setForm((f) => ({ ...f, supplier_id: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select supplier</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        {vendors.length === 0 && (
          <p className="text-sm text-slate-500">
            No suppliers yet.{" "}
            <Link to="/inventory/suppliers" className="font-medium text-teal-600 hover:underline">
              Add a supplier first
            </Link>
            .
          </p>
        )}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          PO number
          <input
            type="text"
            value={form.po_number}
            onChange={(e) => setForm((f) => ({ ...f, po_number: e.target.value }))}
            placeholder="Auto-generated if empty"
            className={inputClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Order date *
            <input
              type="date"
              required
              value={form.order_date}
              onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Expected date
            <input
              type="date"
              value={form.expected_date}
              onChange={(e) => setForm((f) => ({ ...f, expected_date: e.target.value }))}
              className={inputClass}
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Total amount (optional)
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.total_amount}
            onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className={inputClass}
          />
        </label>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.supplier_id}
            className="ui-btn-primary disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create purchase order"}
          </button>
          <Link
            to="/procurement/purchase-orders"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
