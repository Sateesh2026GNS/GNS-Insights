import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { createSupplierPayment, getVendors } from "../../api/procurementApi";
import useTenantId from "../../hooks/useTenantId";



const inputClass =
<<<<<<< HEAD
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";
=======
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

const PAYMENT_METHODS = ["bank", "cash", "cheque", "upi", "other"];

export default function CreateSupplierPayment() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    tenant_id: tenantId,
    supplier_id: "",
    payment_date: new Date().toISOString().slice(0, 10),
<<<<<<< HEAD
    amount: "",
=======
    payment_amount: "",
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    payment_method: "bank",
    reference: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVendors(tenantId)
      .then((r) => setVendors(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createSupplierPayment({
        ...form,
        supplier_id: Number(form.supplier_id),
<<<<<<< HEAD
        amount: Number(form.amount),
=======
        amount: Number(form.payment_amount),
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        reference: form.reference || null,
        notes: form.notes || null,
      });
      navigate("/procurement/supplier-payments");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to record payment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center">
        <p className="text-sm text-slate-500">Loading vendors…</p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        to="/procurement/supplier-payments"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
=======
    <div className="mx-auto max-w-lg space-y-6 p-4 sm:p-6">
      <Link
        to="/procurement/supplier-payments"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      >
        <ArrowLeft className="h-4 w-4" />
        Back to supplier payments
      </Link>
      <PageHeader
<<<<<<< HEAD
        title="Record supplier payment"
        subtitle="Record a payment made to a vendor."
      />
      <form onSubmit={handleSubmit} className="ui-card space-y-4 p-6">
=======
        title="Record Supplier Payment"
        subtitle="Record a payment made to a vendor."
      />
      <form onSubmit={handleSubmit} className="ui-card space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}
        {vendors.length === 0 && (
<<<<<<< HEAD
          <p className="text-sm text-slate-500">
            No vendors yet.{" "}
            <Link to="/procurement/vendors/create" className="font-medium text-teal-600 hover:underline">
              Add a vendor first
=======
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No vendors yet.{" "}
            <Link to="/inventory/suppliers/create" className="font-semibold text-[#2563EB] hover:underline">
              Add a supplier first
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
            </Link>
            .
          </p>
        )}
<<<<<<< HEAD
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Supplier *
=======
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Supplier *
          </label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
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
<<<<<<< HEAD
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Payment date *
=======
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Payment date *
          </label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <input
            type="date"
            required
            value={form.payment_date}
            onChange={(e) => setForm((f) => ({ ...f, payment_date: e.target.value }))}
            className={inputClass}
          />
<<<<<<< HEAD
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Amount *
=======
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Amount *
          </label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <input
            type="number"
            required
            step="0.01"
            min="0"
<<<<<<< HEAD
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="e.g. 5000.00"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Payment method
=======
            value={form.payment_amount}
            onChange={(e) => setForm((f) => ({ ...f, payment_amount: e.target.value }))}
            placeholder="e.g. 5000.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Payment method
          </label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <select
            value={form.payment_method}
            onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}
            className={inputClass}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
<<<<<<< HEAD
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Reference
=======
                {m.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Reference
          </label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <input
            type="text"
            value={form.reference}
            onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
            placeholder="e.g. Bank ref, cheque no."
            className={inputClass}
          />
<<<<<<< HEAD
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes
=======
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Notes
          </label>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className={inputClass}
          />
<<<<<<< HEAD
        </label>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.supplier_id || !form.amount}
            className="ui-btn-primary disabled:opacity-50"
          >
            {saving ? "Saving…" : "Record payment"}
          </button>
          <Link
            to="/procurement/supplier-payments"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
=======
        </div>
        <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-slate-700 justify-end">
          <Link
            to="/procurement/supplier-payments"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.supplier_id || !form.payment_amount}
            className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? "Saving…" : "Record payment"}
          </button>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>
      </form>
    </div>
  );
}