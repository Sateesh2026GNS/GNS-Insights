import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";

import Loader from "../../components/common/Loader";
import ManufacturingWorkflowBar from "../../components/manufacturing/ManufacturingWorkflowBar";
import Table from "../../components/common/Table";
import { getPayments, getInvoices } from "../../api/salesApi";
import useTenantId from "../../hooks/useTenantId";
import useManufacturingRefresh from "../../hooks/useManufacturingRefresh";
import { formatInr } from "../../data/salesMasterData";

export default function PaymentTracking() {
  const tenantId = useTenantId();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getPayments(tenantId), getInvoices(tenantId)])
      .then(([pr, ir]) => {
        setPayments(pr.data || []);
        setInvoices(ir.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  useManufacturingRefresh(load);

  const invMap = Object.fromEntries((invoices || []).map((i) => [i.id, i]));

  if (loading) return <Loader label="Loading payments..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">
            Payments update invoice balances, income, and AR journal entries.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/sales/payments/create" className="ui-btn-primary">
            <Plus className="h-4 w-4" /> Record Payment
          </Link>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <ManufacturingWorkflowBar currentStepId="payment" />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Table
          columns={[
            { key: "id", label: "Payment#" },
            {
              key: "invoice_id",
              label: "Invoice",
              render: (r) => invMap[r.invoice_id]?.invoice_number ?? `INV-${r.invoice_id}`,
            },
            { key: "payment_date", label: "Date" },
            {
              key: "amount",
              label: "Amount",
              render: (r) => formatInr(r.amount),
            },
            { key: "method", label: "Method" },
            { key: "notes", label: "Notes" },
          ]}
          data={payments}
        />
      </div>
    </div>
  );
}
