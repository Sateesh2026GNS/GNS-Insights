<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
<<<<<<< HEAD
  Loader2,
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  Truck,
  Users,
  Zap,
} from "lucide-react";

<<<<<<< HEAD
import { getRecentLogins } from "../../../api/auditLogsApi";
import {
  criticalAlerts,
  employeeAttendance,
  inventorySummary,
  liveProduction,
  lowStockAlerts,
  machineStatus,
  maintenanceSchedule,
  purchaseSummary,
  qualityInspection,
  recentWorkOrders,
  todaysDispatch,
  todaysSummary,
  topProducts,
} from "../../../data/dashboardDummyData";
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
import ChartPanel from "./ChartPanel";

const STATUS_STYLES = {
  running: "bg-emerald-100 text-emerald-700",
  idle: "bg-slate-100 text-slate-600",
  setup: "bg-blue-100 text-blue-700",
  maintenance: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  planned: "bg-slate-100 text-slate-600",
  on_hold: "bg-amber-100 text-amber-700",
  dispatched: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
};

function StatusPill({ status }) {
  const label = String(status).replace(/_/g, " ");
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[status] || STATUS_STYLES.idle}`}>
      {label}
    </span>
  );
}

function WidgetLink({ to, label }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline">
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

<<<<<<< HEAD
export function MachineStatusWidget() {
=======
function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function MachineStatusWidget({ apiData }) {
  const machineStatus = (apiData?.shop_floor_status || []).map((m, index) => ({
    id: m.name || `machine-${index + 1}`,
    name: m.name || `Machine ${index + 1}`,
    status: m.name ? "running" : "idle",
    utilization: toNumber(m.value, 0),
  }));

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Machine Status" action={<WidgetLink to="/factory-monitor/machine-status" label="Monitor" />}>
      <ul className="space-y-2.5">
        {machineStatus.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50/80 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{m.id}</p>
              <p className="truncate text-xs text-slate-500">{m.name}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusPill status={m.status} />
              {m.utilization > 0 && (
                <span className="text-[11px] font-medium text-slate-400">{m.utilization}% util.</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function TopProductsWidget() {
=======
export function TopProductsWidget({ apiData }) {
  const topProducts = (apiData?.recent_work_orders || []).slice(0, 5).map((row, index) => ({
    rank: index + 1,
    name: row.product || row.wo || "Work order",
    sku: row.wo || `WO-${index + 1}`,
    qty: row.qty || 0,
    revenue: row.status || "live",
  }));

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Top Products" subtitle="By volume today" action={<WidgetLink to="/sales/orders" label="View all" />}>
      <ol className="space-y-2">
        {topProducts.map((p) => (
          <li key={p.sku} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] text-xs font-bold text-white">
              {p.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-400">{p.sku}</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-800">{p.qty}</p>
              <p className="text-emerald-600">{p.revenue}</p>
            </div>
          </li>
        ))}
      </ol>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function InventorySummaryWidget() {
  const { rawMaterials, wip, finishedGoods, stores } = inventorySummary;
  return (
    <ChartPanel title="Inventory Summary" action={<WidgetLink to="/inventory" label="Inventory" />}>
      <div className="grid grid-cols-3 gap-2 mb-4">
=======
export function InventorySummaryWidget({ apiData }) {
  const summary = apiData?.inventory_summary || {};
  const rawMaterials = { count: toNumber(summary.raw_materials_count, 0), value: "—", lowStock: toNumber(summary.low_stock_count, 0) };
  const wip = { count: toNumber(summary.wip_items_count, 0), value: "—", lowStock: 0 };
  const finishedGoods = { count: toNumber(summary.finished_goods_count, 0), value: "—", lowStock: 0 };
  const stores = [
    { name: "Main Store", pct: 38, color: "#2563EB" },
    { name: "Production Store", pct: 28, color: "#22C55E" },
    { name: "FG Warehouse", pct: 24, color: "#8B5CF6" },
    { name: "Others", pct: 10, color: "#94A3B8" },
  ];

  return (
    <ChartPanel title="Inventory Summary" action={<WidgetLink to="/inventory" label="Inventory" />}>
      <div className="mb-4 grid grid-cols-3 gap-2">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        {[
          { label: "Raw", data: rawMaterials, color: "#2563EB" },
          { label: "WIP", data: wip, color: "#F59E0B" },
          { label: "FG", data: finishedGoods, color: "#22C55E" },
<<<<<<< HEAD
        ].map(({ label, data, color }) => (
=======
        ].map(({ label, data }) => (
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <div key={label} className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-800">{data.count}</p>
            <p className="text-[11px] text-slate-500">{data.value}</p>
            {data.lowStock > 0 && (
              <p className="mt-1 text-[10px] font-semibold text-red-500">{data.lowStock} low</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex h-3 overflow-hidden rounded-full">
        {stores.map((s) => (
          <div key={s.name} style={{ width: `${s.pct}%`, backgroundColor: s.color }} title={s.name} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
        {stores.map((s) => (
          <span key={s.name} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name} ({s.pct}%)
          </span>
        ))}
      </div>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function TodaysDispatchWidget() {
  const pct = Math.round((todaysDispatch.dispatched / todaysDispatch.total) * 100);
=======
export function TodaysDispatchWidget({ apiData }) {
  const overview = apiData?.orders_overview || { total: 0, inProgress: 0, completed: 0, onHold: 0, progress: 0 };
  const total = toNumber(overview.total, 0);
  const completed = toNumber(overview.completed, 0);
  const pct = total ? Math.round((completed / total) * 100) : 0;

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Today's Dispatch" action={<WidgetLink to="/sales/dispatch" label="Dispatch" />}>
      <div className="mb-3 flex items-end justify-between">
        <div>
<<<<<<< HEAD
          <p className="text-3xl font-bold text-[#0F172A]">{todaysDispatch.dispatched}/{todaysDispatch.total}</p>
=======
          <p className="text-3xl font-bold text-[#0F172A]">{completed}/{total}</p>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <p className="text-xs text-slate-500">Shipments completed</p>
        </div>
        <Truck className="h-5 w-5 text-[#2563EB]" />
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#22C55E]" style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-2">
<<<<<<< HEAD
        {todaysDispatch.items.map((d) => (
          <li key={d.id} className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{d.customer}</span>
=======
        {(apiData?.recent_work_orders || []).slice(0, 3).map((d) => (
          <li key={d.wo || d.id} className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{d.wo || d.order_number || "Work order"}</span>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
            <StatusPill status={d.status} />
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function PurchaseSummaryWidget() {
=======
export function PurchaseSummaryWidget({ apiData }) {
  const summary = apiData?.inventory_summary || {};
  const overview = apiData?.orders_overview || { total: 0, inProgress: 0, completed: 0, onHold: 0, progress: 0 };

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Purchase Summary" action={<WidgetLink to="/procurement/purchase-orders" label="POs" />}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-3">
<<<<<<< HEAD
          <p className="text-xs text-slate-500">Open POs</p>
          <p className="text-2xl font-bold text-[#2563EB]">{purchaseSummary.openPOs}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-xs text-slate-500">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600">{purchaseSummary.pendingApproval}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs text-slate-500">Received Today</p>
          <p className="text-2xl font-bold text-emerald-600">{purchaseSummary.receivedToday}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">PO Value</p>
          <p className="text-xl font-bold text-slate-800">{purchaseSummary.value}</p>
=======
          <p className="text-xs text-slate-500">Open Orders</p>
          <p className="text-2xl font-bold text-[#2563EB]">{toNumber(overview.total, 0)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-xs text-slate-500">Pending Stock</p>
          <p className="text-2xl font-bold text-amber-600">{toNumber(summary.low_stock_count, 0)}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs text-slate-500">Finished Goods</p>
          <p className="text-2xl font-bold text-emerald-600">{toNumber(summary.finished_goods_count, 0)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">In Progress</p>
          <p className="text-xl font-bold text-slate-800">{toNumber(overview.inProgress, 0)}</p>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>
      </div>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function QualityInspectionWidget() {
=======
export function QualityInspectionWidget({ apiData }) {
  const overall = toNumber(apiData?.shop_floor?.oee_pct, 0);
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Quality Inspection" action={<WidgetLink to="/quality/inspection" label="QC" />}>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#22C55E"
              strokeWidth="3"
<<<<<<< HEAD
              strokeDasharray={`${qualityInspection.passRate}, 100`}
=======
              strokeDasharray={`${overall}, 100`}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
<<<<<<< HEAD
            {qualityInspection.passRate}%
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 text-xs">
          <div><span className="text-slate-500">Inspected</span><p className="font-bold text-slate-800">{qualityInspection.inspected}</p></div>
          <div><span className="text-slate-500">Passed</span><p className="font-bold text-emerald-600">{qualityInspection.passed}</p></div>
          <div><span className="text-slate-500">Failed</span><p className="font-bold text-red-500">{qualityInspection.failed}</p></div>
          <div><span className="text-slate-500">Pending</span><p className="font-bold text-amber-600">{qualityInspection.pending}</p></div>
=======
            {overall}%
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 text-xs">
          <div><span className="text-slate-500">Orders</span><p className="font-bold text-slate-800">{toNumber(apiData?.orders_overview?.total, 0)}</p></div>
          <div><span className="text-slate-500">Completed</span><p className="font-bold text-emerald-600">{toNumber(apiData?.orders_overview?.completed, 0)}</p></div>
          <div><span className="text-slate-500">On Hold</span><p className="font-bold text-red-500">{toNumber(apiData?.orders_overview?.onHold, 0)}</p></div>
          <div><span className="text-slate-500">In Progress</span><p className="font-bold text-amber-600">{toNumber(apiData?.orders_overview?.inProgress, 0)}</p></div>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>
      </div>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function LowStockAlertsWidget() {
=======
export function LowStockAlertsWidget({ apiData }) {
  const summary = apiData?.inventory_summary || {};
  const lowStockAlerts = [{
    sku: "low-stock",
    item: "Low stock items",
    qty: toNumber(summary.low_stock_count, 0),
    reorder: toNumber(summary.low_stock_count, 0),
    severity: "warning",
  }];

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Low Stock Alerts" action={<WidgetLink to="/alerts/low-stock" label="All alerts" />}>
      <ul className="space-y-2">
        {lowStockAlerts.map((a) => (
          <li key={a.sku} className="rounded-xl border border-slate-100 px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">{a.item}</p>
              <AlertTriangle className={`h-4 w-4 shrink-0 ${a.severity === "critical" ? "text-red-500" : "text-amber-500"}`} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Stock: <strong>{a.qty}</strong> · Reorder: {a.reorder}
            </p>
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function CriticalAlertsWidget() {
=======
export function CriticalAlertsWidget({ apiData }) {
  const criticalAlerts = (apiData?.alerts_feed || []).slice(0, 4).map((a, index) => ({
    id: a.id ?? index + 1,
    message: a.message || "Live alert from the ERP dashboard",
    time: a.time || "Now",
    severity: a.color === "#EF4444" ? "high" : "medium",
  }));

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Critical Alerts" action={<WidgetLink to="/alerts" label="View all" />}>
      <ul className="space-y-2">
        {criticalAlerts.map((a) => (
          <li key={a.id} className="flex gap-3 rounded-xl bg-slate-50/80 px-3 py-2.5">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.severity === "high" ? "bg-red-500" : "bg-amber-500"}`} />
            <div>
              <p className="text-sm text-slate-700">{a.message}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function RecentWorkOrdersWidget() {
=======
export function RecentWorkOrdersWidget({ apiData }) {
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  return (
    <ChartPanel title="Recent Work Orders" className="lg:col-span-2" action={<WidgetLink to="/production/work-orders" label="All WOs" />}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-3 font-semibold">WO No.</th>
              <th className="pb-2 pr-3 font-semibold">Product</th>
              <th className="pb-2 pr-3 font-semibold">Qty</th>
              <th className="pb-2 pr-3 font-semibold">Status</th>
              <th className="pb-2 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< HEAD
            {recentWorkOrders.map((wo) => (
              <tr key={wo.wo} className="border-b border-slate-50 last:border-0">
=======
            {(apiData?.recent_work_orders || []).slice(0, 5).map((wo) => (
              <tr key={wo.wo || wo.id} className="border-b border-slate-50 last:border-0">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
                <td className="py-2.5 pr-3 font-semibold text-[#2563EB]">{wo.wo}</td>
                <td className="py-2.5 pr-3 text-slate-700">{wo.product}</td>
                <td className="py-2.5 pr-3 tabular-nums">{wo.qty}</td>
                <td className="py-2.5 pr-3"><StatusPill status={wo.status} /></td>
<<<<<<< HEAD
                <td className="py-2.5 text-slate-500">{wo.due}</td>
=======
                <td className="py-2.5 text-slate-500">{wo.due ? String(wo.due).slice(0, 10) : "—"}</td>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function EmployeeAttendanceWidget() {
  const pct = Math.round((employeeAttendance.present / employeeAttendance.total) * 100);
  return (
    <ChartPanel title="Employee Attendance" action={<WidgetLink to="/hr/attendance" label="HR" />}>
      <div className="flex items-center gap-3 mb-3">
        <Users className="h-5 w-5 text-[#2563EB]" />
        <div>
          <p className="text-2xl font-bold text-slate-800">{employeeAttendance.present}/{employeeAttendance.total}</p>
          <p className="text-xs text-slate-500">{pct}% present today</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
        <div className="rounded-lg bg-emerald-50 py-2"><p className="font-bold text-emerald-700">{employeeAttendance.present}</p><p className="text-slate-500">Present</p></div>
        <div className="rounded-lg bg-red-50 py-2"><p className="font-bold text-red-600">{employeeAttendance.absent}</p><p className="text-slate-500">Absent</p></div>
        <div className="rounded-lg bg-amber-50 py-2"><p className="font-bold text-amber-600">{employeeAttendance.onLeave}</p><p className="text-slate-500">Leave</p></div>
      </div>
=======
export function EmployeeAttendanceWidget({ apiData }) {
  const summary = apiData?.todays_summary || [];
  const manpower = summary.find((item) => item.label?.toLowerCase() === "man power")?.value || 0;
  const pct = manpower ? 100 : 0;
  return (
    <ChartPanel title="Employee Attendance" action={<WidgetLink to="/hr/attendance" label="HR" />}>
      <div className="mb-3 flex items-center gap-3">
        <Users className="h-5 w-5 text-[#2563EB]" />
        <div>
          <p className="text-2xl font-bold text-slate-800">{manpower}</p>
          <p className="text-xs text-slate-500">{pct}% present today</p>
        </div>
      </div>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function MaintenanceScheduleWidget() {
  return (
    <ChartPanel title="Maintenance Schedule" action={<WidgetLink to="/maintenance/schedule" label="Schedule" />}>
      <ul className="space-y-2">
        {maintenanceSchedule.map((m) => (
          <li key={`${m.machine}-${m.date}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
            <div>
              <p className="font-semibold text-slate-800">{m.machine}</p>
              <p className="text-xs text-slate-500">{m.type} · {m.date}</p>
=======
export function MaintenanceScheduleWidget({ apiData }) {
  return (
    <ChartPanel title="Maintenance Schedule" action={<WidgetLink to="/maintenance/schedule" label="Schedule" />}>
      <ul className="space-y-2">
        {(apiData?.recent_work_orders || []).slice(0, 3).map((m, index) => (
          <li key={`${m.wo || index}-${m.status}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
            <div>
              <p className="font-semibold text-slate-800">{m.wo}</p>
              <p className="text-xs text-slate-500">{m.product || "Live work order"}</p>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
            </div>
            <StatusPill status={m.status} />
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function LiveProductionWidget() {
  return (
    <ChartPanel title="Live Production Status" action={<WidgetLink to="/factory-monitor/live-production" label="Live view" />}>
      <div className="flex items-center gap-2 mb-3">
=======
export function LiveProductionWidget({ apiData }) {
  const shopFloor = apiData?.shop_floor || {};
  return (
    <ChartPanel title="Live Production Status" action={<WidgetLink to="/factory-monitor/live-production" label="Live view" />}>
      <div className="mb-3 flex items-center gap-2">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
<<<<<<< HEAD
        <span className="text-sm font-semibold text-emerald-700">Live · {liveProduction.linesActive}/{liveProduction.linesTotal} lines active</span>
=======
        <span className="text-sm font-semibold text-emerald-700">Live · {toNumber(shopFloor.active_machines, 0)} active</span>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1e3a5f] p-4 text-white">
          <p className="text-xs text-slate-300">Current Output</p>
<<<<<<< HEAD
          <p className="text-2xl font-bold">{liveProduction.currentOutput.toLocaleString()}</p>
=======
          <p className="text-2xl font-bold">{toNumber(shopFloor.todays_production, 0).toLocaleString()}</p>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          <p className="text-xs text-slate-400">units today</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Hourly Rate</p>
<<<<<<< HEAD
          <p className="text-2xl font-bold text-[#2563EB]">{liveProduction.hourlyRate}</p>
          <p className="text-xs text-slate-400">units/hr</p>
=======
          <p className="text-2xl font-bold text-[#2563EB]">{toNumber(shopFloor.active_machines, 0)}</p>
          <p className="text-xs text-slate-400">active machines</p>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs">
        <Zap className="h-4 w-4 text-emerald-600" />
<<<<<<< HEAD
        <span>Efficiency at <strong>{liveProduction.efficiency}%</strong></span>
=======
        <span>Efficiency at <strong>{toNumber(shopFloor.oee_pct, 0)}%</strong></span>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </div>
    </ChartPanel>
  );
}

<<<<<<< HEAD
export function TodaysSummaryWidget() {
  return (
    <ChartPanel title="Today's Summary">
      <dl className="space-y-3 text-sm">
        {[
          ["Manpower", todaysSummary.manpower],
          ["Working Hours", todaysSummary.workingHours],
          ["Power Consumption", todaysSummary.powerConsumption],
          ["Target Achievement", todaysSummary.targetAchievement],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-bold text-slate-800">{value}</dd>
=======
export function TodaysSummaryWidget({ apiData }) {
  const summaryItems = apiData?.todays_summary || [];
  return (
    <ChartPanel title="Today's Summary">
      <dl className="space-y-3 text-sm">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
            <dt className="text-slate-500">{item.label}</dt>
            <dd className="font-bold text-slate-800">{item.value}</dd>
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          </div>
        ))}
      </dl>
    </ChartPanel>
  );
}

<<<<<<< HEAD
function RecentLoginActivityWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getRecentLogins(10)
      .then((res) => {
        if (active) setItems(res.data?.items || []);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <ChartPanel
      title="Recent Login Activity"
      action={
        <Link to="/settings/security" className="text-xs font-semibold text-teal-600 hover:underline">
          View all
        </Link>
      }
    >
      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No recent logins yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {row.full_name || row.email || "Unknown"}
                </p>
                <p className="text-xs text-slate-500">
                  {row.role || "—"} · {row.time || row.date || "—"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  row.login_status === "Success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {row.login_status || "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ChartPanel>
  );
}

export default function DashboardWidgets() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <RecentLoginActivityWidget />
      <MachineStatusWidget />
      <TopProductsWidget />
      <InventorySummaryWidget />
      <TodaysDispatchWidget />
      <PurchaseSummaryWidget />
      <QualityInspectionWidget />
      <LowStockAlertsWidget />
      <CriticalAlertsWidget />
      <EmployeeAttendanceWidget />
      <MaintenanceScheduleWidget />
      <LiveProductionWidget />
      <TodaysSummaryWidget />
      <RecentWorkOrdersWidget />
=======
export default function DashboardWidgets({ apiData }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <MachineStatusWidget apiData={apiData} />
      <TopProductsWidget apiData={apiData} />
      <InventorySummaryWidget apiData={apiData} />
      <TodaysDispatchWidget apiData={apiData} />
      <PurchaseSummaryWidget apiData={apiData} />
      <QualityInspectionWidget apiData={apiData} />
      <LowStockAlertsWidget apiData={apiData} />
      <CriticalAlertsWidget apiData={apiData} />
      <EmployeeAttendanceWidget apiData={apiData} />
      <MaintenanceScheduleWidget apiData={apiData} />
      <LiveProductionWidget apiData={apiData} />
      <TodaysSummaryWidget apiData={apiData} />
      <RecentWorkOrdersWidget apiData={apiData} />
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    </div>
  );
}
