import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { canAccess } from "../../config/permissions";

const modules = [
  { labelKey: "nav.productionManagement", to: "/production/planning", emoji: "🏭", module: "production" },
  { labelKey: "nav.inventoryManagement", to: "/inventory", emoji: "📦", module: "inventory" },
  { labelKey: "nav.procurementManagement", to: "/procurement/purchase-orders", emoji: "🛒", module: "procurement" },
  { labelKey: "nav.hrManagement", to: "/hr", emoji: "👥", module: "hr" },
  { labelKey: "nav.salesBilling", to: "/sales/orders", emoji: "💰", module: "sales" },
  { labelKey: "nav.accountsReports", to: "/accounts", emoji: "📒", module: "accounts" },
  { labelKey: "nav.qualityControl", to: "/quality/inspection", emoji: "✅", module: "quality" },
  { labelKey: "nav.maintenance", to: "/maintenance/machines", emoji: "🔧", module: "maintenance" },
  { labelKey: "nav.analytics", to: "/analytics/production", emoji: "📊", module: "analytics" },
  { labelKey: "nav.iotSmartFactory", to: "/iot", emoji: "📡", module: "iot" },
];

export default function ModuleCards() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const role = user?.role || "Operator";
  const visible = modules.filter((m) => canAccess(role, m.module));

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {visible.map((m) => (
        <Link
          key={m.to}
          to={m.to}
          className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition-all hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/50 text-xl">
            {m.emoji}
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
            {t(m.labelKey)}
          </span>
        </Link>
      ))}
    </div>
  );
}
