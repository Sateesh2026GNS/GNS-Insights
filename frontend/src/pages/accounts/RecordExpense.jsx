import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createExpense } from "../../api/accountsApi";
import { getVendors } from "../../api/procurementApi";
import useTenantId from "../../hooks/useTenantId";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/common/Loader";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function RecordExpense() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [form, setForm] = useState({
    tenant_id: tenantId,
    category: "",
    vendor: "",
    amount: "",
    expense_date: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadVendors = () => {
    setLoadingVendors(true);
    getVendors()
      .then((r) => setVendors(r.data || []))
      .catch(console.error)
      .finally(() => setLoadingVendors(false));
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendor) {
      setError("Please select a vendor.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await createExpense({ ...form, amount: Number(form.amount) });
      addToast("Expense recorded successfully", "success");
      navigate("/accounts/expenses");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to save expense");
      addToast("Failed to record expense", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loadingVendors) return <Loader label="Loading vendors…" />;

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 sm:p-6">
      <div>
        <Link to="/accounts/expenses" className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back to Expenses
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Record Expense</h1>
        <p className="mt-1 text-sm text-slate-500">Record a new business expense payment transaction.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700">Category *</label>
          <input
            type="text"
            required
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="e.g. Store Rental, Office Supplies"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 font-semibold mb-1">Vendor *</label>
          <select
            required
            value={form.vendor}
            onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">— Select vendor —</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="e.g. 5000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date *</label>
            <input
              type="date"
              required
              value={form.expense_date}
              onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Additional transaction details..."
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Link
            to="/accounts/expenses"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving…</>
            ) : (
              <><Save className="h-4 w-4" /> Save Expense</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}