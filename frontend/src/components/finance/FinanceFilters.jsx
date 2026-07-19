import { Search, RotateCcw } from "lucide-react";
import { BRANCHES, FINANCIAL_YEARS } from "../../data/financeMasterData";

const MONTHS = [
  "All Months", "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all cursor-pointer";

export default function FinanceFilters({
  search,
  onSearchChange,
  financialYear,
  onFinancialYearChange,
  month,
  onMonthChange,
  branch,
  onBranchChange,
  searchPlaceholder = "Search...",
  children,
}) {
  const handleReset = () => {
    onSearchChange("");
    onFinancialYearChange("All Years");
    onMonthChange("All Months");
    onBranchChange("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 pl-10 pr-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
            />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Financial Year
          </label>
          <select
            value={financialYear}
            onChange={(e) => onFinancialYearChange(e.target.value)}
            className={inputClass}
          >
            {FINANCIAL_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className={inputClass}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Branch
          </label>
          <select
            value={branch}
            onChange={(e) => onBranchChange(e.target.value)}
            className={inputClass}
          >
            <option value="">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all"
          >
            <RotateCcw className="h-4 w-4 text-slate-400" />
            Reset
          </button>
        </div>
        
        {children && <div className="lg:col-span-12 mt-2">{children}</div>}
      </div>
    </div>
  );
}
