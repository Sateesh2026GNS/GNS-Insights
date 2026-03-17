import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const routes = [
  { path: "/", labelKey: "nav.dashboard" },
  { path: "/production/planning", labelKey: "nav.productionPlanning" },
  { path: "/production/work-orders", labelKey: "nav.workOrders" },
  { path: "/production/machines", labelKey: "nav.machineStatus" },
  { path: "/inventory", labelKey: "nav.lowStockAlerts" },
  { path: "/inventory/items", labelKey: "nav.rawMaterialTracking" },
  { path: "/procurement/purchase-orders", labelKey: "nav.purchaseOrders" },
  { path: "/sales/orders", labelKey: "nav.salesOrders" },
  { path: "/sales/invoices", labelKey: "nav.invoiceGeneration" },
  { path: "/accounts", labelKey: "nav.exportExcelPdf" },
  { path: "/hr", labelKey: "nav.hrManagement" },
  { path: "/iot", labelKey: "nav.iotDashboard" },
];

export default function GlobalSearch({ onSelect }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);

  const matches = useMemo(() => {
    if (!query.trim()) return routes.slice(0, 6);
    const q = query.toLowerCase();
    return routes.filter((r) =>
      t(r.labelKey).toLowerCase().includes(q) || r.path.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, t]);

  const showDropdown = open && (focus || query);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = (path) => {
    navigate(path);
    setQuery("");
    setOpen(false);
    onSelect?.();
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        ref={inputRef}
        type="search"
        placeholder={t("common.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setOpen(true); setFocus(true); }}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 transition-all"
        aria-label={t("common.search")}
      />
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">No matches</div>
          ) : (
            matches.map((r) => (
              <button
                key={r.path}
                type="button"
                onClick={() => handleSelect(r.path)}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center gap-2"
              >
                <span className="truncate">{t(r.labelKey)}</span>
                <span className="text-xs text-slate-400 ml-auto">{r.path}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
