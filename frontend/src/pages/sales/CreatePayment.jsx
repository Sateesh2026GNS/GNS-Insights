import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import { getInvoices, createPayment } from "../../api/salesApi";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all";

export default function CreatePayment() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedInvoice = searchParams.get("invoice_id");
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({
    tenant_id: tenantId,
    invoice_id: preselectedInvoice || "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    method: "cash",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getInvoices(tenantId)
      .then((r) => setInvoices(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tenantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPayment({
        ...form,
        invoice_id: Number(form.invoice_id),
        amount: Number(form.amount),
      });
      navigate("/finance/payment-tracking");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading invoices..." />;

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 sm:p-6">
      <Link
        to="/finance/payment-tracking"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to payment tracking
      </Link>
      <PageHeader
        title="Record Customer Payment"
        subtitle="Record a payment receipt received from a customer."
      />
      <form onSubmit={handleSubmit} className="ui-card space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Invoice *
          </label>
          <select
            value={form.invoice_id}
            onChange={(e) => setForm((f) => ({ ...f, invoice_id: e.target.value }))}
            required
            className={inputClass}
          >
            <option value="">Select invoice</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                INV-{inv.invoice_number} - {inv.customer_name || "N/A"} - ₹{Number(inv.grand_total).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Payment Date
          </label>
          <input
            type="date"
            value={form.payment_date}
            onChange={(e) => setForm((f) => ({ ...f, payment_date: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Method
          </label>
          <select
            value={form.method}
            onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
            className={inputClass}
          >
            <option value="cash">CASH</option>
            <option value="bank">BANK TRANSFER</option>
            <option value="card">CARD</option>
            <option value="cheque">CHEQUE</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 dark:border-slate-700 justify-end">
          <Link
            to="/finance/payment-tracking"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving…</>
            ) : (
              <><Save className="h-4 w-4" /> Record Payment</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}