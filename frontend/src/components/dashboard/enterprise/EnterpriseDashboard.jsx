<<<<<<< HEAD
import { useEffect, useState } from "react";

import { kpiMetrics } from "../../../data/dashboardDummyData";
=======
import { useEffect, useMemo, useState } from "react";

import { getErpDashboard } from "../../../api/dashboardApi";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
import DashboardCharts from "./DashboardCharts";
import DashboardFooter from "./DashboardFooter";
import DashboardHero from "./DashboardHero";
import DashboardWidgets from "./DashboardWidgets";
import KpiCard from "./KpiCard";
import QuickActionsPanel from "./QuickActionsPanel";

<<<<<<< HEAD
export default function EnterpriseDashboard() {
  const [now, setNow] = useState(() => new Date());
=======
const KPI_ICON_MAP = {
  "total-orders": "ShoppingCart",
  "today-production": "Factory",
  "machines-running": "Settings",
  "production-efficiency": "Speed",
  "pending-orders": "PendingActions",
  "good-qty": "Verified",
  "reject-qty": "Cancel",
  "revenue-today": "CurrencyRupee",
};

const KPI_ACCENT_MAP = {
  "total-orders": "#2563EB",
  "today-production": "#22C55E",
  "machines-running": "#8B5CF6",
  "production-efficiency": "#0EA5E9",
  "pending-orders": "#F59E0B",
  "good-qty": "#14B8A6",
  "reject-qty": "#EF4444",
  "revenue-today": "#0F172A",
};

const KPI_BG_MAP = {
  "total-orders": "from-blue-500/10 to-blue-600/5",
  "today-production": "from-emerald-500/10 to-emerald-600/5",
  "machines-running": "from-violet-500/10 to-violet-600/5",
  "production-efficiency": "from-sky-500/10 to-sky-600/5",
  "pending-orders": "from-amber-500/10 to-amber-600/5",
  "good-qty": "from-teal-500/10 to-teal-600/5",
  "reject-qty": "from-red-500/10 to-red-600/5",
  "revenue-today": "from-slate-500/10 to-slate-600/5",
};

export default function EnterpriseDashboard() {
  const [now, setNow] = useState(() => new Date());
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

<<<<<<< HEAD
=======
  useEffect(() => {
    let active = true;
    setLoading(true);
    getErpDashboard()
      .then((res) => {
        if (active) setApiData(res.data ?? null);
      })
      .catch(() => {
        if (active) setApiData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const kpiMetrics = useMemo(() => {
    const cards = apiData?.kpi_cards ?? [];
    return cards.map((metric) => ({
      id: metric.id,
      title: metric.title || metric.id,
      value: metric.value ?? "0",
      unit: metric.unit,
      suffix: metric.suffix,
      trend: metric.trend ?? "0%",
      trendUp: metric.trendUp ?? true,
      subtitle: metric.trendLabel || "live update",
      icon: KPI_ICON_MAP[metric.id] || "Settings",
      accent: KPI_ACCENT_MAP[metric.id] || "#2563EB",
      bg: KPI_BG_MAP[metric.id] || "from-blue-500/10 to-blue-600/5",
    }));
  }, [apiData]);

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <div className="-mx-1 space-y-6 animate-[fadeIn_0.4s_ease-out] sm:space-y-8">
      <DashboardHero now={now} />

      <section aria-label="Key performance indicators">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Performance Overview
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
<<<<<<< HEAD
            Live Data
=======
            {loading ? "Loading live data" : "Live Data"}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8">
          {kpiMetrics.map((metric) => (
            <KpiCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <QuickActionsPanel />

      <section aria-label="Analytics charts">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
          Analytics & Trends
        </h2>
<<<<<<< HEAD
        <DashboardCharts />
=======
        <DashboardCharts apiData={apiData} />
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </section>

      <section aria-label="Operational widgets">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
          Operations Intelligence
        </h2>
<<<<<<< HEAD
        <DashboardWidgets />
=======
        <DashboardWidgets apiData={apiData} />
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </section>

      <DashboardFooter />
    </div>
  );
}
