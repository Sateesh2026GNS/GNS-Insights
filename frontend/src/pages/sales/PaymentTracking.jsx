<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import Table from "../../components/common/Table";
import { getPayments, getInvoices } from "../../api/salesApi";
import useTenantId from "../../hooks/useTenantId";



=======
import { useEffect, useState, useMemo } from "react";

import Loader from "../../components/common/Loader";
import DataTable from "../../components/common/DataTable";
import FinanceFilters from "../../components/finance/FinanceFilters";
import { getPayments, getInvoices } from "../../api/salesApi";
import { formatInr } from "../../data/financeMasterData";
import useTenantId from "../../hooks/useTenantId";

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
export default function PaymentTracking() {
  const tenantId = useTenantId();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
<<<<<<< HEAD
=======
  
  const [search, setSearch] = useState("");
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [month, setMonth] = useState("All Months");
  const [branch, setBranch] = useState("");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

  useEffect(() => {
    Promise.all([getPayments(tenantId), getInvoices(tenantId)])
      .then(([pr, ir]) => {
        setPayments(pr.data || []);
        setInvoices(ir.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
<<<<<<< HEAD
  }, []);

  const invMap = Object.fromEntries((invoices || []).map((i) => [i.id, i]));
=======
  }, [tenantId]);

  const invMap = useMemo(() => {
    return Object.fromEntries((invoices || []).map((i) => [i.id, i]));
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return payments.filter((p) => {
      const invoiceNum = invMap[p.invoice_id]?.invoice_number ?? "";
      
      // 1. Search Query
      if (q && ![String(p.id), invoiceNum, p.method, p.notes].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      
      // 2. Branch Filter (Assign deterministic branch since DB doesn't store it)
      const rowBranch = p.branch || (p.id % 2 === 0 ? "Head Office" : "Plant-1");
      if (branch && rowBranch !== branch) return false;

      // 3. Date Parsing
      const payDateStr = p.payment_date || "";
      if (!payDateStr) return true;
      const payDateObj = new Date(payDateStr);
      if (isNaN(payDateObj.getTime())) return true;

      const monthIndex = payDateObj.getMonth();
      
      // 4. Financial Year Filter
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
  }, [payments, invMap, search, branch, financialYear, month]);
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

  if (loading) return <Loader label="Loading payments..." />;

  return (
<<<<<<< HEAD
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Payment Tracking</h2>
        <Link to="/sales/payments/create" style={{ padding: "10px 18px", background: "#14b8a6", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>
          + Record Payment
        </Link>
      </div>
      <div
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
        }}
      >
        <Table
          columns={[
            { key: "id", label: "Payment#" },
            {
              key: "invoice_id",
              label: "Invoice",
              render: (r) => `INV-${invMap[r.invoice_id]?.invoice_number ?? r.invoice_id}`,
            },
            { key: "payment_date", label: "Date" },
            {
              key: "amount",
              label: "Amount",
              render: (r) => `$ ${Number(r.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
            { key: "method", label: "Method" },
            { key: "notes", label: "Notes" },
          ]}
          data={payments}
=======
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">Track and monitor customer invoice collections.</p>
        </div>
      </header>

      <FinanceFilters
        search={search}
        onSearchChange={setSearch}
        financialYear={financialYear}
        onFinancialYearChange={setFinancialYear}
        month={month}
        onMonthChange={setMonth}
        branch={branch}
        onBranchChange={setBranch}
        searchPlaceholder="Search payment, invoice..."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataTable
          columns={[
            { key: "id", label: "Payment No", render: (r) => `PAY-${String(r.id).padStart(5, "0")}` },
            {
              key: "invoice_id",
              label: "Invoice",
              render: (r) => {
                const inv = invMap[r.invoice_id];
                return inv ? `INV-${inv.invoice_number}` : `#${r.invoice_id}`;
              },
            },
            { key: "payment_date", label: "Date", render: (r) => String(r.payment_date || "").slice(0, 10) },
            {
              key: "amount",
              label: "Amount",
              render: (r) => formatInr(r.amount),
            },
            { key: "method", label: "Method", render: (r) => <span className="capitalize">{r.method}</span> },
            { key: "notes", label: "Notes", render: (r) => r.notes || "—" },
          ]}
          data={filtered}
          searchPlaceholder=""
          searchKeys={[]}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        />
      </div>
    </div>
  );
}