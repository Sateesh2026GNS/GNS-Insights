import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ClipboardList,
  Cpu,
  Package,
  Users,
  TrendingUp,
  Factory,
  ArrowRight,
  DollarSign,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import SkeletonCard, { SkeletonChart } from "../../components/common/SkeletonCard";
import Table from "../../components/common/Table";
import QuickActions from "../../components/common/QuickActions";
import ModuleCards from "../../components/common/ModuleCards";
import { getAccountsDashboard } from "../../api/accountsApi";
import { getAnalyticsDashboard } from "../../api/analyticsApi";
import { getHrDashboard } from "../../api/hrApi";
import { getInventoryDashboard } from "../../api/inventoryApi";
import {
  getBatches,
  getDailyReports,
  getMachines,
  getProductionOrders,
  getWorkOrders,
} from "../../api/productionApi";

const TENANT_ID = 1;

const StatCard = ({ title, value, subtext, href, icon: Icon, color, style, viewLabel }) => (
  <Link
    to={href}
    className={`group relative overflow-hidden rounded-2xl p-6 ${color || ""} transition-all hover:scale-[1.02] hover:shadow-lg`}
    style={style}
  >
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {subtext && <p className="mt-1 text-sm opacity-80">{subtext}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-white/20 p-3">
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-90 group-hover:underline">
        {viewLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

const SectionCard = ({ title, href, children, icon: Icon, viewAllLabel }) => (
  <section className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 p-6 shadow-sm transition-all hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        {Icon && <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
        {title}
      </h3>
      {href && (
        <Link
          to={href}
          className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline inline-flex items-center gap-1"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
    {children}
  </section>
);


export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const [productionOrders, setProductionOrders] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [batches, setBatches] = useState([]);
  const [machines, setMachines] = useState([]);
  const [dailyReports, setDailyReports] = useState([]);
  const [inventoryDashboard, setInventoryDashboard] = useState([]);
  const [hrDashboard, setHrDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [accountsDashboard, setAccountsDashboard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apis = [
        () => getProductionOrders(TENANT_ID),
        () => getWorkOrders(TENANT_ID),
        () => getBatches(TENANT_ID),
        () => getMachines(TENANT_ID),
        () => getDailyReports(TENANT_ID),
        () => getInventoryDashboard(TENANT_ID),
        () => getHrDashboard(TENANT_ID),
        () => getAnalyticsDashboard(TENANT_ID),
        () => getAccountsDashboard(TENANT_ID),
      ];
      try {
        const results = await Promise.allSettled(apis.map((fn) => fn()));
        const [
          ordersRes,
          workOrdersRes,
          batchesRes,
          machinesRes,
          reportsRes,
          invRes,
          hrRes,
          analyticsRes,
          accountsRes,
        ] = results;
        const getData = (r) => (r.status === "fulfilled" ? r.value?.data : null);
        const failedCount = results.filter((r) => r.status === "rejected").length;
        setApiFailed(failedCount > 0);
        setProductionOrders(getData(ordersRes) || []);
        setWorkOrders(getData(workOrdersRes) || []);
        setBatches(getData(batchesRes) || []);
        setMachines(getData(machinesRes) || []);
        setDailyReports(getData(reportsRes) || []);
        setInventoryDashboard(getData(invRes) || []);
        setHrDashboard(getData(hrRes) || null);
        setAnalytics(getData(analyticsRes) || null);
        setAccountsDashboard(getData(accountsRes) || null);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lowStockCount = inventoryDashboard.filter((i) => i.needs_reorder).length;
  const runningMachines = machines.filter((m) => m.status === "running").length;
  const pendingWorkOrders = workOrders.filter((w) => !["completed", "cancelled"].includes(w.status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayProduction = dailyReports
    .filter((r) => r.report_date === today)
    .reduce((sum, r) => sum + (parseFloat(r.produced_quantity) || 0), 0);
  const todayRevenue = accountsDashboard?.total_settlement
    ? `₹${(accountsDashboard.total_settlement / 1000).toFixed(0)}K`
    : "₹0";

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return t("dashboard.goodMorning", { defaultValue: "Good morning" });
    if (h < 17) return t("dashboard.goodAfternoon", { defaultValue: "Good afternoon" });
    return t("dashboard.goodEvening", { defaultValue: "Good evening" });
  })();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl">
        {apiFailed && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50/90 px-4 py-3 text-sm text-amber-900">
            {t("dashboard.apiFailed")} <code className="rounded bg-amber-100 px-1">cd backend && uvicorn app.main:app</code>
          </div>
        )}
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-teal-100 text-sm font-medium">{greeting}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
              {user?.name ? `${user.name}, ` : ""}{t("dashboard.title")}
            </h1>
            <p className="mt-2 text-teal-100/90 text-sm">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-white/10 backdrop-blur px-4 py-3 text-sm">
            <span>{now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</span>
            <span className="font-semibold tabular-nums">{now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-32 w-64 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 h-24 w-48 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">{t("dashboard.quickActions", { defaultValue: "Quick Actions" })}</h2>
        <QuickActions />
      </div>

      {/* Module Shortcuts */}
      <div>
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">{t("dashboard.moduleShortcuts", { defaultValue: "Modules" })}</h2>
        <ModuleCards />
      </div>

      {/* 6 Key KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title={t("dashboard.todayProduction")}
          value={Math.round(todayProduction)}
          subtext={t("dashboard.unitsProduced")}
          href="/production/reports"
          icon={Factory}
          color="text-white"
          style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)" }}
          viewLabel={t("common.viewDetails")}
        />
        <StatCard
          title={t("dashboard.activeMachines")}
          value={runningMachines}
          subtext={t("dashboard.ofTotal", { count: machines.length })}
          href="/production/machines"
          icon={TrendingUp}
          color="text-white"
          style={{ background: "linear-gradient(135deg, var(--color-running) 0%, #16a34a 100%)" }}
          viewLabel={t("common.viewDetails")}
        />
        <StatCard
          title={t("dashboard.pendingWorkOrders")}
          value={pendingWorkOrders}
          subtext={t("dashboard.inQueue")}
          href="/production/work-orders"
          icon={ClipboardList}
          color="text-white"
          style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)" }}
          viewLabel={t("common.viewDetails")}
        />
        <StatCard
          title={t("dashboard.lowStockItems")}
          value={lowStockCount}
          subtext={lowStockCount > 0 ? t("dashboard.needReorder") : t("dashboard.allStocked")}
          href="/inventory"
          icon={Package}
          color="text-white"
          style={{ background: lowStockCount > 0 ? "linear-gradient(135deg, var(--color-stopped) 0%, #dc2626 100%)" : "linear-gradient(135deg, var(--color-running) 0%, #16a34a 100%)" }}
          viewLabel={t("common.viewDetails")}
        />
        <StatCard
          title={t("dashboard.workersPresent")}
          value={hrDashboard?.attendance_today ?? 0}
          subtext={t("dashboard.ofTotal", { count: hrDashboard?.headcount ?? 0 })}
          href="/hr"
          icon={Users}
          color="text-white"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)" }}
          viewLabel={t("common.viewDetails")}
        />
        <StatCard
          title={t("dashboard.todaysRevenue")}
          value={todayRevenue}
          subtext={t("dashboard.totalSettlement")}
          href="/accounts"
          icon={DollarSign}
          color="text-white"
          style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-light) 100%)" }}
          viewLabel={t("common.viewDetails")}
        />
      </div>

      {/* Analytics Section */}
      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t("dashboard.analytics")}</h2>
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400">{t("dashboard.live")}</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Production Trend */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">{t("dashboard.monthlyProductionTrend")}</h3>
            <div style={{ width: "100%", minWidth: 1, height: 192 }}>
              <ResponsiveContainer width="100%" height={192} minHeight={192}>
                <LineChart data={analytics?.monthly_production_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Machine Efficiency */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">{t("dashboard.machineEfficiency")}</h3>
            <div className="flex items-center gap-8">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--color-running)"
                    strokeWidth="3"
                    strokeDasharray={`${analytics?.machine_efficiency?.overall_percent || 0}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">
                  {analytics?.machine_efficiency?.overall_percent ?? 0}%
                </span>
              </div>
              <div className="flex-1 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Running</span><span className="font-medium">{analytics?.machine_efficiency?.running ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Idle</span><span className="font-medium">{analytics?.machine_efficiency?.idle ?? 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Down</span><span className="font-medium" style={{ color: "var(--color-stopped)" }}>{analytics?.machine_efficiency?.down ?? 0}</span></div>
              </div>
            </div>
          </div>
          {/* Inventory Usage */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">{t("dashboard.inventoryUsage")}</h3>
            <div style={{ width: "100%", minWidth: 1, height: 192 }}>
              <ResponsiveContainer width="100%" height={192} minHeight={192}>
                <BarChart data={[
                  { name: "Turnover", value: analytics?.inventory_turnover?.rate ?? 0 },
                  { name: "Out", value: Math.min(10, analytics?.inventory_turnover?.total_out_movements ?? 0) },
                  { name: "Avg Stock", value: Math.min(100, analytics?.inventory_turnover?.average_inventory ?? 0) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Monthly Sales */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">{t("dashboard.monthlySales")}</h3>
            <div style={{ width: "100%", minWidth: 1, height: 192 }}>
              <ResponsiveContainer width="100%" height={192} minHeight={192}>
                <BarChart data={(accountsDashboard?.monthly_settlement || []).slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]} />
                  <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Worker Performance Score - extra info */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-2 font-semibold text-slate-800">{t("dashboard.workerPerformanceScore")}</h3>
            <p className="mb-4 text-xs text-slate-500">Average from performance reviews</p>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold" style={{ backgroundColor: "rgba(30,58,138,0.1)", color: "var(--color-primary)" }}>
                {Math.round(analytics?.worker_performance?.average_score ?? 75)}
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800">/ 100</span>
                <p className="text-xs text-slate-500">{analytics?.worker_performance?.reviews_count ?? 0} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title={t("dashboard.productionPlanning")} href="/production/planning" icon={ClipboardList} viewAllLabel={t("common.viewAll")}>
            <Table
              columns={[
                { key: "order_number", label: t("dashboard.order") },
                { key: "product_id", label: t("dashboard.product") },
                { key: "planned_quantity", label: t("dashboard.planned") },
                {
                  key: "status",
                  label: t("dashboard.status"),
                  render: (r) => (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : r.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  ),
                },
              ]}
              data={productionOrders.slice(0, 5)}
            />
          </SectionCard>

          <SectionCard title={t("dashboard.batchTracking")} href="/production/batches" icon={Package} viewAllLabel={t("common.viewAll")}>
            <Table
              columns={[
                { key: "batch_code", label: t("dashboard.batch") },
                { key: "work_order_id", label: t("dashboard.workOrder") },
                { key: "quantity", label: "Qty" },
                {
                  key: "status",
                  label: t("dashboard.status"),
                  render: (r) => (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  ),
                },
              ]}
              data={batches.slice(0, 5)}
            />
          </SectionCard>

          <SectionCard title={t("dashboard.workOrders")} href="/production/work-orders" icon={ClipboardList} viewAllLabel={t("common.viewAll")}>
            <Table
              columns={[
                { key: "work_order_number", label: t("dashboard.workOrder") },
                { key: "production_order_id", label: t("dashboard.prodOrder") },
                { key: "planned_quantity", label: t("dashboard.planned") },
                {
                  key: "status",
                  label: t("dashboard.status"),
                  render: (r) => (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : r.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  ),
                },
              ]}
              data={workOrders.slice(0, 5)}
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title={t("dashboard.machineStatus")} href="/production/machines" icon={Cpu} viewAllLabel={t("common.viewAll")}>
            <div className="space-y-3">
              {machines.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
                  {t("dashboard.noMachines")}
                </div>
              ) : (
                machines.map((machine) => (
                  <div
                    key={machine.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{machine.name}</div>
                      <div className="text-xs text-slate-500">
                        {machine.code} · {machine.location || "—"}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        machine.status === "running"
                          ? "bg-green-100 text-green-800"
                          : machine.status === "down"
                          ? "bg-red-100 text-red-800"
                          : machine.status === "maintenance"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {machine.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/hr"
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 shadow-sm transition-all hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md"
            >
              <span className="text-sm font-medium text-slate-500">{t("dashboard.hrSummary")}</span>
              <span className="mt-2 text-2xl font-bold text-slate-900">
                {hrDashboard?.headcount ?? 0}
              </span>
              <span className="mt-1 text-sm text-slate-600">
                {hrDashboard?.attendance_today ?? 0} {t("dashboard.inToday")}
              </span>
            </Link>
            <Link
              to="/inventory"
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 shadow-sm transition-all hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md"
            >
              <span className="text-sm font-medium text-slate-500">{t("dashboard.inventory")}</span>
              <span className="mt-2 text-2xl font-bold text-slate-900">
                {inventoryDashboard.length}
              </span>
              <span className="mt-1 text-sm text-slate-600">
                {lowStockCount} {t("dashboard.lowStock")}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Daily Reports */}
      <SectionCard title={t("dashboard.dailyProductionReports")} href="/production/reports" icon={TrendingUp} viewAllLabel={t("common.viewAll")}>
        <Table
          columns={[
            { key: "report_date", label: t("dashboard.date") },
            { key: "product_id", label: t("dashboard.product") },
            { key: "produced_quantity", label: t("dashboard.produced") },
            { key: "scrap_quantity", label: t("dashboard.scrap") },
            { key: "downtime_minutes", label: t("dashboard.downtime") },
          ]}
          data={dailyReports.slice(0, 6)}
        />
      </SectionCard>

    </div>
  );
}
