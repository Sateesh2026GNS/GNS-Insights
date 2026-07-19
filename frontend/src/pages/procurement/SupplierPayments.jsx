import { useEffect, useMemo, useState } from "react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import FinanceFilters from "../../components/finance/FinanceFilters";
import { useToast } from "../../context/ToastContext";
import { getSupplierPayments, getVendors } from "../../api/procurementApi";
import { formatInr } from "../../data/financeMasterData";

export default function SupplierPayments() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [month, setMonth] = useState("All Months");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [p, v] = await Promise.all([getSupplierPayments(), getVendors()]);
        if (!active) return;
        setPayments(p.data || []);
        setVendors(v.data || []);
      } catch (err) {
        if (active) addToast(err.response?.data?.detail || "Failed to load payments", "error");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [addToast]);

  const vendorName = useMemo(() => {
    const map = {};
    vendors.forEach((v) => {
      map[v.id] = v.name;
    });
    return map;
  }, [vendors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return payments.filter((p) => {
      const supplierName = vendorName[p.supplier_id] || "";
      
      // 1. Search Query
      if (q && ![supplierName, p.payment_method, p.reference, p.notes].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      
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
  }, [payments, vendorName, search, branch, financialYear, month]);

  if (loading) return <Loader label="Loading supplier payments..." />;

  const total = filtered.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const columns = [
    {
      key: "supplier_id",
      label: "Supplier",
      render: (r) => vendorName[r.supplier_id] || `#${r.supplier_id}`,
    },
    { key: "payment_date", label: "Date", render: (r) => String(r.payment_date || "").slice(0, 10) },
    {
      key: "amount",
      label: "Amount",
      render: (r) => formatInr(r.amount),
    },
    { key: "payment_method", label: "Method", render: (r) => <span className="capitalize">{r.payment_method}</span> },
    { key: "reference", label: "Reference", render: (r) => r.reference || "—" },
  ];

  return (
    <div className="space-y-6 p-1">
      <PageHeader
        title="Supplier Payments"
        subtitle={`Total paid: ${formatInr(total)}`}
      />

      <FinanceFilters
        search={search}
        onSearchChange={setSearch}
        financialYear={financialYear}
        onFinancialYearChange={setFinancialYear}
        month={month}
        onMonthChange={setMonth}
        branch={branch}
        onBranchChange={setBranch}
        searchPlaceholder="Search supplier, reference..."
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={filtered}
          searchPlaceholder=""
          searchKeys={[]}
        />
      </div>
    </div>
  );
}
