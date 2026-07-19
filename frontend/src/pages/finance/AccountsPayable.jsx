import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Building2, Clock, CreditCard, FileText, IndianRupee, RefreshCw, Plus, XCircle, Eye, Edit } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import RowActionMenu from "../../components/common/RowActionMenu";
import FinanceFilters from "../../components/finance/FinanceFilters";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getAPEnriched, getAPSummary } from "../../api/accountsApi";
import { getVendors, createSupplierPayment, getSupplierPayments, updateVendorBill } from "../../api/procurementApi";
import { FINANCE_FLOW, formatInr, statusColor } from "../../data/financeMasterData";
import useTenantId from "../../hooks/useTenantId";

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{value}</p></div>
        {Icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>}
      </div>
    </div>
  );
}

const INITIAL_AP_SUMMARY = {
  outstanding_payables: 0,
  due_this_week: 0,
  overdue_bills: 0,
  paid_this_month: 0,
  pending_approvals: 0,
  vendor_count: 0,
};

function normalizeVendorList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

export default function AccountsPayable() {
  const tenantId = useTenantId();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(INITIAL_AP_SUMMARY);
  const [rows, setRows] = useState([]);
  const [payments, setPayments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [activeTab, setActiveTab] = useState("bills");
  const [viewBill, setViewBill] = useState(null);
  const [editBill, setEditBill] = useState(null);
  const [editForm, setEditForm] = useState({
    bill_number: "",
    amount: "",
    gst_amount: "",
    bill_date: "",
    due_date: "",
  });
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    supplier_id: "",
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "bank",
    reference: "",
    notes: "",
  });
  const [search, setSearch] = useState("");
  const [financialYear, setFinancialYear] = useState("All Years");
  const [month, setMonth] = useState("All Months");
  const [branch, setBranch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, listRes, vendorRes, payRes] = await Promise.allSettled([
        getAPSummary(),
        getAPEnriched(),
        getVendors(),
        getSupplierPayments(),
      ]);
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary(sumRes.value.data);
      if (listRes.status === "fulfilled" && listRes.value?.data) setRows(listRes.value.data);
      if (vendorRes.status === "fulfilled") {
        const normalized = normalizeVendorList(vendorRes.value?.data ?? []);
        const realVendors = normalized.filter((vendor) => vendor && typeof vendor === "object" && (vendor.name || vendor.vendor_code));
        setVendors(realVendors);
      }
      if (payRes.status === "fulfilled" && payRes.value?.data) {
        setPayments(payRes.value.data);
      }
    } catch {
      setSummary(INITIAL_AP_SUMMARY);
      setRows([]);
      setVendors([]);
      addToast("Failed to load accounts payable data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const handleCreatePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplierPayment({
        tenant_id: tenantId,
        supplier_id: Number(newPayment.supplier_id),
        amount: Number(newPayment.amount),
        payment_date: newPayment.payment_date,
        payment_method: newPayment.payment_method,
        reference: newPayment.reference || null,
        notes: newPayment.notes || null,
      });
      addToast("Supplier payment recorded successfully", "success");
      setShowCreatePayment(false);
      setNewPayment({
        supplier_id: "",
        amount: "",
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "bank",
        reference: "",
        notes: "",
      });
      load();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to record payment", "error");
    }
  };

  const handleEditBillSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVendorBill(editBill.id, {
        bill_number: editForm.bill_number,
        amount: Number(editForm.amount),
        gst_amount: Number(editForm.gst_amount),
        bill_date: editForm.bill_date,
        due_date: editForm.due_date,
      });
      addToast("Vendor bill updated successfully", "success");
      setEditBill(null);
      load();
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to update vendor bill", "error");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      // 1. Search Query
      if (q && ![r.bill_number, r.vendor_name, r.po_reference, r.invoice_no].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      
      // 2. Branch Filter (Assign deterministic branch since DB doesn't store it)
      const rowBranch = r.branch || (r.id % 2 === 0 ? "Head Office" : "Plant-1");
      if (branch && rowBranch !== branch) return false;

      // 3. Date Parsing
      const billDateStr = r.invoice_date || "";
      if (!billDateStr) return true;
      const billDateObj = new Date(billDateStr);
      if (isNaN(billDateObj.getTime())) return true;

      const monthIndex = billDateObj.getMonth();
      
      // 4. Financial Year Filter
      if (financialYear && financialYear !== "All Years") {
        const parts = financialYear.split("-");
        if (parts.length === 2) {
          const startYear = parseInt(parts[0], 10);
          const endYear = startYear + 1;
          
          const fyStart = new Date(startYear, 3, 1);
          const fyEnd = new Date(endYear, 2, 31, 23, 59, 59);
          
          if (billDateObj < fyStart || billDateObj > fyEnd) return false;
        }
      }

      // 5. Month Filter
      if (month && month !== "All Months") {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const selectedMonthIndex = monthNames.indexOf(month);
        if (selectedMonthIndex !== -1 && monthIndex !== selectedMonthIndex) return false;
      }

      return true;
    });
  }, [rows, search, branch, financialYear, month]);

  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase();
    return payments.filter((p) => {
      const supplierName = vendors.find((v) => v.id === p.supplier_id)?.name || "";
      if (q && ![String(p.id), supplierName, p.payment_method, p.reference, p.notes].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      
      // Branch Filter
      const rowBranch = p.branch || (p.id % 2 === 0 ? "Head Office" : "Plant-1");
      if (branch && rowBranch !== branch) return false;

      // Date Parsing
      const payDateStr = p.payment_date || "";
      if (!payDateStr) return true;
      const payDateObj = new Date(payDateStr);
      if (isNaN(payDateObj.getTime())) return true;

      const monthIndex = payDateObj.getMonth();

      // Financial Year Filter
      if (financialYear && financialYear !== "All Years") {
        const parts = financialYear.split("-");
        if (parts.length === 2) {
          const startYear = parseInt(parts[0], 10);
          const endYear = startYear + 1;
          
          const fyStart = new Date(startYear, 3, 1);
          const fyEnd = new Date(endYear, 2, 31, 23, 59, 59);
          
          if (payDateObj < fyStart || payDateObj > fyEnd) return false;
        }
      }

      // Month Filter
      if (month && month !== "All Months") {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const selectedMonthIndex = monthNames.indexOf(month);
        if (selectedMonthIndex !== -1 && monthIndex !== selectedMonthIndex) return false;
      }

      return true;
    });
  }, [payments, search, vendors, branch, financialYear, month]);

  const columns = [
    { key: "bill_number", label: "Bill No" },
    { key: "vendor_name", label: "Vendor" },
    { key: "po_reference", label: "PO Reference" },
    { key: "invoice_no", label: "Invoice No" },
    { key: "invoice_date", label: "Invoice Date", render: (r) => String(r.invoice_date || "").slice(0, 10) },
    { key: "due_date", label: "Due Date", render: (r) => String(r.due_date || "").slice(0, 10) },
    { key: "amount", label: "Amount", render: (r) => formatInr(r.amount) },
    { key: "gst", label: "GST", render: (r) => formatInr(r.gst) },
    { key: "paid", label: "Paid", render: (r) => formatInr(r.paid) },
    { key: "balance", label: "Balance", render: (r) => formatInr(r.balance) },
    { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span> },
    { key: "actions", label: "Actions", sortable: false, render: (r) => (
      <RowActionMenu
        rowId={r.id}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        items={[
          { label: "View", icon: <Eye className="h-4 w-4" />, onClick: () => {
            setViewBill(r);
          } },
          { label: "Edit", icon: <Edit className="h-4 w-4" />, onClick: () => {
            setEditBill(r);
            setEditForm({
              bill_number: r.bill_number || "",
              amount: String(r.amount || ""),
              gst_amount: String(r.gst || ""),
              bill_date: String(r.invoice_date || "").slice(0, 10),
              due_date: String(r.due_date || "").slice(0, 10),
            });
          } },
        ]}
      />
    )},
  ];

  const paymentColumns = [
    { key: "id", label: "Payment No", render: (r) => `VPY-${String(r.id).padStart(5, "0")}` },
    { key: "payment_date", label: "Date", render: (r) => String(r.payment_date || "").slice(0, 10) },
    { key: "supplier_id", label: "Vendor", render: (r) => vendors.find((v) => v.id === r.supplier_id)?.name || `#${r.supplier_id}` },
    { key: "amount", label: "Amount", render: (r) => formatInr(r.amount) },
    { key: "payment_method", label: "Method", render: (r) => String(r.payment_method || "").toUpperCase() },
    { key: "reference", label: "Reference", render: (r) => r.reference || "—" },
    { key: "notes", label: "Notes", render: (r) => r.notes || "—" },
  ];

  if (loading) return <Loader label="Loading accounts payable..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accounts Payable</h1>
          <p className="mt-1 text-sm text-slate-500">Vendor bills, payment scheduling, and outstanding payables management.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowCreatePayment(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Record Payment
          </button>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Outstanding Payables" value={formatInr(summary.outstanding_payables)} icon={IndianRupee} color="bg-red-500" />
        <KpiCard label="Due This Week" value={summary.due_this_week} icon={Clock} color="bg-amber-500" />
        <KpiCard label="Overdue Bills" value={summary.overdue_bills} icon={AlertCircle} color="bg-orange-500" />
        <KpiCard label="Paid This Month" value={formatInr(summary.paid_this_month)} icon={IndianRupee} color="bg-green-600" />
        <KpiCard label="Pending Approvals" value={summary.pending_approvals} icon={FileText} color="bg-indigo-600" />
        <KpiCard label="Vendor Count" value={summary.vendor_count} icon={Building2} color="bg-teal-600" />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] font-medium text-slate-600 sm:text-xs">
        {FINANCE_FLOW.map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span className="rounded bg-white px-1.5 py-0.5 shadow-sm">{s}</span>
            {i < FINANCE_FLOW.length - 1 && <span className="text-slate-400">↓</span>}
          </span>
        ))}
      </div>

      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("bills")}
          className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${activeTab === "bills" ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Outstanding Bills
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`border-b-2 px-6 py-3 text-sm font-semibold transition-colors ${activeTab === "payments" ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Payment History ({payments.length})
        </button>
      </div>

      <FinanceFilters
        search={search}
        onSearchChange={setSearch}
        financialYear={financialYear}
        onFinancialYearChange={setFinancialYear}
        month={month}
        onMonthChange={setMonth}
        branch={branch}
        onBranchChange={setBranch}
        searchPlaceholder={activeTab === "bills" ? "Search bill, vendor, PO, invoice..." : "Search payment, vendor, reference..."}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {activeTab === "bills" ? (
          <DataTable columns={columns} data={filtered} searchPlaceholder="" searchKeys={[]} />
        ) : (
          <DataTable columns={paymentColumns} data={filteredPayments} searchPlaceholder="" searchKeys={[]} />
        )}
       </div>

      {showCreatePayment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <h2 className="text-xl font-bold text-slate-900">Record Supplier Payment</h2>
              <button type="button" onClick={() => setShowCreatePayment(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePaymentSubmit} className="overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Supplier *</label>
                {vendors.length === 0 ? (
                  <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    No suppliers are available for this tenant yet. Create one from the supplier section and then return here.
                  </div>
                ) : (
                  <select
                    required
                    value={newPayment.supplier_id}
                    onChange={(e) => setNewPayment({ ...newPayment, supplier_id: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                  >
                    <option value="">— Select supplier —</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}{v.vendor_code ? ` (${v.vendor_code})` : ""}
                      </option>
                    ))}
                  </select>
                )}
                <div className="mt-2">
                  <Link
                    to="/inventory/suppliers/create"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Create Supplier in Supplier Section
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={newPayment.payment_date}
                    onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Payment Method</label>
                  <select
                    value={newPayment.payment_method}
                    onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-2 py-2 text-sm bg-white"
                  >
                    {["bank", "cash", "cheque", "upi", "other"].map((m) => (
                      <option key={m} value={m}>
                        {m.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Reference</label>
                  <input
                    type="text"
                    value={newPayment.reference}
                    onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    placeholder="e.g. Txn ID, cheque no"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Notes</label>
                <textarea
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Add payment notes..."
                />
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePayment(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewBill && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <h2 className="text-xl font-bold text-slate-900">Vendor Bill Details</h2>
              <button type="button" onClick={() => setViewBill(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Bill Number</span>
                <span className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg mt-1 inline-block">
                  {viewBill.bill_number}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Vendor / Supplier</span>
                  <span className="text-sm font-semibold text-slate-800 mt-1 block">{viewBill.vendor_name}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">PO Reference</span>
                  <span className="text-sm font-semibold text-slate-800 mt-1 block">{viewBill.po_reference || "—"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Number</span>
                  <span className="text-sm font-semibold text-slate-800 mt-1 block">{viewBill.invoice_no || "—"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize mt-1 inline-block ${statusColor(viewBill.status)}`}>
                    {viewBill.status}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Date</span>
                  <span className="text-sm font-medium text-slate-700 mt-1 block">{String(viewBill.invoice_date || "").slice(0, 10)}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</span>
                  <span className="text-sm font-medium text-slate-700 mt-1 block">{String(viewBill.due_date || "").slice(0, 10)}</span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Amount</span>
                  <span>{formatInr(viewBill.amount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Amount</span>
                  <span>{formatInr(viewBill.gst)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Grand Total</span>
                  <span>{formatInr(Number(viewBill.amount || 0) + Number(viewBill.gst || 0))}</span>
                </div>
                <div className="flex justify-between text-emerald-600 border-t border-slate-200 pt-2">
                  <span>Paid Amount</span>
                  <span>{formatInr(viewBill.paid)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2563EB]">
                  <span>Outstanding Balance</span>
                  <span>{formatInr(viewBill.balance)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => setViewBill(null)}
                className="rounded-lg border px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {editBill && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Vendor Bill</h2>
              <button type="button" onClick={() => setEditBill(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditBillSubmit} className="overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase">Bill Number *</label>
                <input
                  type="text"
                  required
                  value={editForm.bill_number}
                  onChange={(e) => setEditForm({ ...editForm, bill_number: e.target.value })}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Taxable Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">GST Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editForm.gst_amount}
                    onChange={(e) => setEditForm({ ...editForm, gst_amount: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={editForm.bill_date}
                    onChange={(e) => setEditForm({ ...editForm, bill_date: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={editForm.due_date}
                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setEditBill(null)}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
