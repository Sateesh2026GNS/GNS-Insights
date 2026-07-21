import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Building2, IndianRupee, Landmark, RefreshCw, Scale, TrendingUp } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import FinanceFilters from "../../components/finance/FinanceFilters";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getGLEnriched, getGLSummary } from "../../api/accountsApi";
<<<<<<< HEAD
import { COST_CENTERS, DEMO_GL_LIST, DEMO_GL_SUMMARY, GL_PLANNED_FEATURES, formatInr } from "../../data/financeMasterData";
=======
import { COST_CENTERS, GL_PLANNED_FEATURES, formatInr } from "../../data/financeMasterData";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

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

<<<<<<< HEAD
export default function GeneralLedger() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(DEMO_GL_SUMMARY);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [financialYear, setFinancialYear] = useState("2025-26");
=======
const INITIAL_GL_SUMMARY = {
  total_assets: 0,
  total_liabilities: 0,
  equity: 0,
  revenue: 0,
  expenses: 0,
  cash_balance: 0,
};

export default function GeneralLedger() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(INITIAL_GL_SUMMARY);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [financialYear, setFinancialYear] = useState("All Years");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  const [month, setMonth] = useState("All Months");
  const [branch, setBranch] = useState("");
  const [costCenter, setCostCenter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, listRes] = await Promise.allSettled([getGLSummary(), getGLEnriched()]);
<<<<<<< HEAD
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary({ ...DEMO_GL_SUMMARY, ...sumRes.value.data });
      if (listRes.status === "fulfilled" && listRes.value?.data?.length) setRows(listRes.value.data);
      else setRows([]);
    } catch {
=======
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary(sumRes.value.data);
      if (listRes.status === "fulfilled" && listRes.value?.data) setRows(listRes.value.data);
    } catch {
      setSummary(INITIAL_GL_SUMMARY);
      setRows([]);
      addToast("Failed to load general ledger data", "error");
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
<<<<<<< HEAD
      if (q && ![r.voucher_no, r.account, r.narration].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      if (branch && r.branch && r.branch !== branch) return false;
      if (costCenter && r.cost_center && r.cost_center !== costCenter) return false;
      return true;
    });
  }, [rows, search, branch, costCenter]);
=======
      // 1. Search Query
      if (q && ![r.voucher_no, r.account, r.narration].some((v) => String(v || "").toLowerCase().includes(q))) return false;
      
      // 2. Branch Filter (Assign fallback if not in list)
      const rowBranch = r.branch || (r.id % 2 === 0 ? "Head Office" : "Plant-1");
      if (branch && rowBranch !== branch) return false;

      // 3. Cost Center Filter
      if (costCenter && r.cost_center && r.cost_center !== costCenter) return false;

      // 4. Date Parsing
      const entryDateStr = r.entry_date || "";
      if (!entryDateStr) return true;
      const entryDateObj = new Date(entryDateStr);
      if (isNaN(entryDateObj.getTime())) return true;

      const monthIndex = entryDateObj.getMonth();

      // 5. Financial Year Filter
      if (financialYear && financialYear !== "All Years") {
        const parts = financialYear.split("-");
        if (parts.length === 2) {
          const startYear = parseInt(parts[0], 10);
          const endYear = startYear + 1;
          
          const fyStart = new Date(startYear, 3, 1);
          const fyEnd = new Date(endYear, 2, 31, 23, 59, 59);
          
          if (entryDateObj < fyStart || entryDateObj > fyEnd) return false;
        }
      }

      // 6. Month Filter
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
  }, [rows, search, branch, costCenter, financialYear, month]);
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

  const columns = [
    { key: "voucher_no", label: "Voucher No" },
    { key: "entry_date", label: "Date", render: (r) => String(r.entry_date || "").slice(0, 10) },
    { key: "account", label: "Account" },
    { key: "debit", label: "Debit", render: (r) => r.debit ? formatInr(r.debit) : "—" },
    { key: "credit", label: "Credit", render: (r) => r.credit ? formatInr(r.credit) : "—" },
    { key: "balance", label: "Balance", render: (r) => formatInr(r.balance) },
    { key: "narration", label: "Narration" },
    { key: "cost_center", label: "Cost Center" },
    { key: "branch", label: "Branch" },
  ];

  if (loading) return <Loader label="Loading general ledger..." />;

<<<<<<< HEAD
  const hasData = rows.length > 0;

  return (
=======
return (
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">General Ledger</h1>
          <p className="mt-1 text-sm text-slate-500">Central accounting ledger — vouchers, journal entries, and cost center allocation.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Assets" value={formatInr(summary.total_assets)} icon={Building2} color="bg-blue-600" />
        <KpiCard label="Total Liabilities" value={formatInr(summary.total_liabilities)} icon={Scale} color="bg-amber-500" />
        <KpiCard label="Equity" value={formatInr(summary.equity)} icon={Landmark} color="bg-indigo-600" />
        <KpiCard label="Revenue" value={formatInr(summary.revenue)} icon={TrendingUp} color="bg-green-600" />
        <KpiCard label="Expenses" value={formatInr(summary.expenses)} icon={IndianRupee} color="bg-red-500" />
        <KpiCard label="Cash Balance" value={formatInr(summary.cash_balance)} icon={BookOpen} color="bg-teal-600" />
      </div>

<<<<<<< HEAD
      {!hasData && (
=======
      {rows.length === 0 && (
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Coming Soon — Full GL Module</h2>
          <p className="mt-2 text-sm text-slate-500">Journal entries will auto-post from AP, AR, and payment workflows.</p>
          <ul className="mx-auto mt-6 grid max-w-lg gap-2 text-left text-sm text-slate-600 sm:grid-cols-2">
            {GL_PLANNED_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />{f}</li>
            ))}
          </ul>
        </div>
      )}

      <FinanceFilters
        search={search}
        onSearchChange={setSearch}
        financialYear={financialYear}
        onFinancialYearChange={setFinancialYear}
        month={month}
        onMonthChange={setMonth}
        branch={branch}
        onBranchChange={setBranch}
        searchPlaceholder="Search voucher, account, narration..."
      >
<<<<<<< HEAD
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Cost Center</label>
          <select value={costCenter} onChange={(e) => setCostCenter(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">All</option>
=======
        <div className="w-full">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Cost Center</label>
          <select
            value={costCenter}
            onChange={(e) => setCostCenter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all cursor-pointer"
          >
            <option value="">All Cost Centers</option>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
            {COST_CENTERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </FinanceFilters>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataTable columns={columns} data={filtered} searchPlaceholder="" searchKeys={[]} />
      </div>
    </div>
  );
}
