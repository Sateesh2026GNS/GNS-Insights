<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import { createSalesOrder } from "../../api/salesApi";
import { fetchCustomersWithFallback, resolveCustomerId } from "../../utils/customerOptions";
import useTenantId from "../../hooks/useTenantId";



const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export default function CreateSalesOrder() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenant_id: tenantId,
    customer_id: "",
    order_number: "",
    reference_number: "",
    order_date: new Date().toISOString().slice(0, 10),
    status: "draft",
    total_amount: "",
  });

  useEffect(() => {
    fetchCustomersWithFallback()
      .then(setCustomers)
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const customerId = await resolveCustomerId(form.customer_id, customers, tenantId);
      await createSalesOrder({
        ...form,
        customer_id: customerId,
        order_number: form.order_number || `SO-${Date.now()}`,
        total_amount: Number(form.total_amount) || 0,
      });
      navigate("/sales/orders");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading customers..." />;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        to="/sales/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sales orders
      </Link>
      <PageHeader
        title="New sales order"
        subtitle="Pick a customer and save. You can add lines or change status later."
      />
      <form onSubmit={handleSubmit} className="ui-card space-y-4 p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Customer *
          <select
            required
            value={form.customer_id}
            onChange={(e) => setForm((f) => ({ ...f, customer_id: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {customers.length === 0 && (
          <p className="text-sm text-slate-500">
            No customers yet.{" "}
            <Link to="/sales/customers" className="font-medium text-teal-600 hover:underline">
              Add a customer first
            </Link>
            .
          </p>
        )}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Order number
          <input
            type="text"
            value={form.order_number}
            onChange={(e) => setForm((f) => ({ ...f, order_number: e.target.value }))}
            placeholder="Auto-generated if empty"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Reference number
          <input
            type="text"
            value={form.reference_number}
            onChange={(e) => setForm((f) => ({ ...f, reference_number: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Order date
          <input
            type="date"
            value={form.order_date}
            onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Total amount
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.total_amount}
            onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
            className={inputClass}
          />
        </label>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !form.customer_id}
            className="ui-btn-primary disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create sales order"}
          </button>
          <Link
            to="/sales/orders"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
=======
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import { createSalesOrder } from "../../api/salesApi";
import { fetchCustomersWithFallback, resolveCustomerId } from "../../utils/customerOptions";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function CreateSalesOrder() {
  const tenantId = useTenantId();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenant_id: tenantId,
    customer_id: "",
    order_number: "",
    reference_number: "",
    order_date: new Date().toISOString().slice(0, 10),
    status: "draft",
    total_amount: "",
  });

  useEffect(() => {
    fetchCustomersWithFallback()
      .then(setCustomers)
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const customerId = await resolveCustomerId(form.customer_id, customers, tenantId);
      await createSalesOrder({
        ...form,
        customer_id: customerId,
        order_number: form.order_number || `SO-${Date.now()}`,
        total_amount: Number(form.total_amount) || 0,
      });
      navigate("/sales/orders");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading customers..." />;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <div>
        <Link
          to="/sales/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sales Orders
        </Link>
      </div>

      <PageHeader
        title="New Sales Order"
        subtitle="Create a new sales order to begin processing details and shipments."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Form Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                Customer *
              </label>
              <select
                required
                value={form.customer_id}
                onChange={(e) => setForm((f) => ({ ...f, customer_id: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  No customers found.{" "}
                  <Link to="/sales/customers" className="font-semibold text-[#2563EB] hover:underline">
                    Add a customer first
                  </Link>
                  .
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                Order Number
              </label>
              <input
                type="text"
                value={form.order_number}
                onChange={(e) => setForm((f) => ({ ...f, order_number: e.target.value }))}
                placeholder="Auto-generated if empty"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                Reference Number
              </label>
              <input
                type="text"
                value={form.reference_number}
                onChange={(e) => setForm((f) => ({ ...f, reference_number: e.target.value }))}
                placeholder="e.g. PO-8921"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                Order Date
              </label>
              <input
                type="date"
                value={form.order_date}
                onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                Total Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.total_amount}
                onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t pt-5">
            <Link
              to="/sales/orders"
              className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !form.customer_id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Create Sales Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
}