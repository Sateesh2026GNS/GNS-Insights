import { useEffect, useState, useCallback } from "react";
import { RefreshCw, TrendingUp, HelpCircle, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import FinanceFilters from "../../components/finance/FinanceFilters";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getExtendedReports } from "../../api/accountsApi";
import { formatInr } from "../../data/financeMasterData";

export default function BudgetActual() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [month, setMonth] = useState("All Months");
  const [branch, setBranch] = useState("");
  const [search, setSearch] = useState("");
  const [budgets, setBudgets] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExtendedReports(financialYear, month, branch);
      if (res.data && res.data.budget_actuals) {
        setBudgets(res.data.budget_actuals);
      }
    } catch {
      addToast("Failed to load Budget vs Actual data", "error");
    } finally {
      setLoading(false);
    }
  }, [financialYear, month, branch, addToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = budgets.filter((b) =>
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalBudget = filtered.reduce((s, b) => s + b.budget, 0);
  const totalActual = filtered.reduce((s, b) => s + b.actual, 0);
  const totalVariance = totalBudget - totalActual;

  if (loading) return <Loader label="Loading Budget vs Actual..." />;

  const budgetPct = totalBudget > 0 ? ((totalVariance / totalBudget) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 border-b-0 pb-0">Budget vs Actual</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Monitor departmental budget targets and analyze operational cost variance parameters.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Budget Target" value={formatInr(totalBudget)} icon={FileSpreadsheet} color="bg-blue-600" />
        <KpiCard label="Total Actual Spending" value={formatInr(totalActual)} icon={TrendingUp} color="bg-indigo-600" />
        <KpiCard label="Consolidated Variance" value={formatInr(totalVariance)} icon={HelpCircle} color={totalVariance >= 0 ? "bg-green-600" : "bg-red-500"} />
        <KpiCard label="Variance percentage" value={`${budgetPct}%`} icon={ShieldAlert} color="bg-amber-500" />
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
        searchPlaceholder="Search budget categories..."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50/50">
            <h2 className="font-bold text-slate-800">Operational Variance Audit Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 text-left font-semibold">
                  <th className="p-3">Cost Category Description</th>
                  <th className="p-3 text-right">Budget Target (₹)</th>
                  <th className="p-3 text-right">Actual Posting (₹)</th>
                  <th className="p-3 text-right">Variance Amount (₹)</th>
                  <th className="p-3 text-center">Variance %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((b) => (
                  <tr key={b.category} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-900 font-semibold">{b.category}</td>
                    <td className="p-3 text-right text-slate-800 font-semibold tabular-nums">{formatInr(b.budget)}</td>
                    <td className="p-3 text-right text-slate-800 font-semibold tabular-nums">{formatInr(b.actual)}</td>
                    <td className={`p-3 text-right font-bold tabular-nums ${b.variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {b.variance >= 0 ? "+" : ""}{formatInr(b.variance)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        b.variance >= 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {((b.variance / b.budget) * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-slate-400">
                      No budget comparisons recorded for the selected period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Budget vs Actual Variance Comparison</h2>
          <div className="h-64">
            {filtered.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                  <YAxis tickFormatter={(v) => formatInr(v)} />
                  <Tooltip formatter={(v) => formatInr(v)} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#94A3B8" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="actual" name="Actual" fill="#2563EB" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No chart data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
