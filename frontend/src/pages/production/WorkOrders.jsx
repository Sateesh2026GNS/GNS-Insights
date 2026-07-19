import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Pause,
  Play,
  Plus,
  RefreshCw,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import WorkOrderDetailModal, {
  WorkOrderCompleteModal,
  WorkOrderStartModal,
} from "../../components/production/WorkOrderDetailModal";
import { useToast } from "../../context/ToastContext";
import {
  completeWorkOrder,
  deleteWorkOrder,
  getWorkOrderDetail,
  getWorkOrderStartChecks,
  getWorkOrders,
  getWorkOrderSummary,
  pauseWorkOrder,
  startWorkOrder,
  stopWorkOrder,
} from "../../api/productionApi";
import {
  DEPARTMENTS,
  DEMO_WORK_ORDERS,
  PRIORITIES,
  SHIFTS,
  canWoComplete,
  canWoPause,
  canWoStart,
  computeWorkOrderSummary,
  enrichApiWorkOrder,
  priorityBadge,
  woStatusLabel,
} from "../../data/workOrdersMasterData";
import { exportToExcel, exportToPdf } from "../../utils/exportUtils";

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 truncate text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">{value}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function PriorityPill({ priority }) {
  const p = priorityBadge(priority);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${p.bg} ${p.text}`}>
      {p.dot} {p.label}
    </span>
  );
}

function ProgressCell({ row }) {
  const pct = row.progress_pct ?? 0;
  return (
    <div className="min-w-[110px]">
      <div className="mb-0.5 flex justify-between text-[10px] text-slate-500">
        <span>{row.produced_quantity ?? 0}/{row.planned_quantity}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

const defaultFilters = {
  work_order: "",
  production_order: "",
  product: "",
  customer: "",
  machine: "",
  department: "",
  shift: "",
  priority: "",
  status: "",
};

export default function WorkOrders() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.role].filter(Boolean);
  const hasEditPermission = !userRoles.some((r) => ["operator", "store manager", "hr manager", "accountant"].includes(r.toLowerCase()));

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const hasLoadedRef = useRef(false);
  const [summary, setSummary] = useState(computeWorkOrderSummary([]));
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filters, setFilters] = useState(() => {
    const initFilters = { ...defaultFilters };
    searchParams.forEach((value, key) => {
      if (key in initFilters) {
        initFilters[key] = value;
      }
    });
    return initFilters;
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startModal, setStartModal] = useState(null);
  const [startChecks, setStartChecks] = useState([]);
  const [startLoading, setStartLoading] = useState(false);
  const [completeModal, setCompleteModal] = useState(null);
  const [completeSteps, setCompleteSteps] = useState([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filters.work_order && !String(o.work_order_number || "").toLowerCase().includes(filters.work_order.toLowerCase())) return false;
      if (filters.production_order && !String(o.production_order_number || "").toLowerCase().includes(filters.production_order.toLowerCase())) return false;
      if (filters.product && !String(o.product_name || "").toLowerCase().includes(filters.product.toLowerCase())) return false;
      if (filters.customer && !String(o.customer_name || "").toLowerCase().includes(filters.customer.toLowerCase())) return false;
      if (filters.machine && !String(o.machine_name || "").toLowerCase().includes(filters.machine.toLowerCase())) return false;
      if (filters.department && o.department !== filters.department) return false;
      if (filters.shift && o.shift !== filters.shift) return false;
      if (filters.priority && o.priority !== filters.priority) return false;
      if (filters.status && o.status !== filters.status) return false;
      return true;
    });
  }, [orders, filters]);

  const summaryMetrics = useMemo(() => {
    const base = summary || {};
    return {
      total_work_orders: base.total_work_orders ?? base.total_orders ?? filteredOrders.length,
      planned_orders: base.planned_orders ?? 0,
      in_progress_orders: base.in_progress_orders ?? 0,
      completed_orders: base.completed_orders ?? 0,
      delayed_orders: base.delayed_orders ?? 0,
      high_priority_orders: base.high_priority_orders ?? 0,
    };
  }, [summary, filteredOrders.length]);

  const load = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const [woRes, summaryRes] = await Promise.all([
        getWorkOrders().catch(() => ({ data: [] })),
        getWorkOrderSummary().catch(() => ({ data: null })),
      ]);
      const apiRows = Array.isArray(woRes.data) ? woRes.data : [];
      const rows = apiRows.length > 0
        ? apiRows.map((row, index) => enrichApiWorkOrder(row, index))
        : DEMO_WORK_ORDERS.map((row, index) => enrichApiWorkOrder(row, index));
      setOrders(rows);
      setSummary(summaryRes.data || computeWorkOrderSummary(rows));
    } catch {
      const demoRows = DEMO_WORK_ORDERS.map((row, index) => enrichApiWorkOrder(row, index));
      setOrders(demoRows);
      setSummary(computeWorkOrderSummary(demoRows));
    } finally {
      if (showLoader || !hasLoadedRef.current) {
        setLoading(false);
        hasLoadedRef.current = true;
      }
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [location.key, load]);

  const openOrder = async (order) => {
    setSelected(order);
    setDetail(null);
    if (typeof order.id === "number") {
      try {
        const res = await getWorkOrderDetail(order.id);
        setDetail(enrichApiWorkOrder(res.data || {}));
      } catch {
        // fall back to the list item
      }
    }
  };

  const handleStartClick = async (order) => {
    if (typeof order.id === "number") {
      try {
        const res = await getWorkOrderStartChecks(order.id);
        setStartChecks(res.data || []);
        setStartModal(order);
        return;
      } catch {
        addToast("Could not load start checks", "error");
        return;
      }
    }
    setStartChecks([
      { check_type: "material", label: "Material Availability", ready: true, message: "All required materials available" },
      { check_type: "machine", label: "Machine Availability", ready: !!order.machine_name, message: order.machine_name ? "Machine ready" : "No machine assigned" },
      { check_type: "operator", label: "Operator Availability", ready: !!order.operator_name, message: order.operator_name ? "Operator assigned" : "No operator" },
    ]);
    setStartModal(order);
  };

  const confirmStart = async () => {
    const order = startModal;
    if (!order) return;
    setStartLoading(true);
    try {
      const res = await startWorkOrder(order.id);
      if (res.data?.success) {
        addToast("Work order started");
        load();
        setStartModal(null);
      } else {
        setStartChecks(res.data?.checks || []);
        addToast(res.data?.message || "Checks failed", "error");
      }
    } catch (err) {
      addToast(err.response?.data?.detail || "Start failed", "error");
    } finally {
      setStartLoading(false);
    }
  };

  const handlePause = async (order) => {
    if (typeof order.id === "number") {
      try {
        await pauseWorkOrder(order.id);
        addToast("Work order paused");
        load();
      } catch {
        addToast("Pause failed", "error");
      }
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "planned" } : o)));
    addToast("Work order paused");
  };

  const handleStop = async (order) => {
    if (typeof order.id === "number") {
      try {
        await stopWorkOrder(order.id);
        addToast("Work order stopped");
        load();
      } catch {
        addToast("Stop failed", "error");
      }
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "paused" } : o)));
    addToast("Work order stopped");
  };

  const handleComplete = async (order) => {
    if (typeof order.id === "number") {
      try {
        const res = await completeWorkOrder(order.id);
        if (res.data?.success) {
          setCompleteSteps(res.data.steps || []);
          setCompleteModal(order);
          addToast(res.data.message || "Work order completed");
          load();
          setSelected(null);
        } else {
          addToast(res.data?.message || "Complete failed", "error");
        }
      } catch (err) {
        addToast(err.response?.data?.detail || "Complete failed", "error");
      }
      return;
    }
    setCompleteSteps([
      "Work order completed",
      "Quality inspection updated",
      "Inventory updated",
    ]);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "completed", produced_quantity: o.planned_quantity, progress_pct: 100 } : o)));
    setCompleteModal(order);
    addToast("Work order completed");
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete work order ${order.work_order_number}?`)) return;
    try {
      const res = await deleteWorkOrder(order.id);
      if (res.data?.success || res.status === 200) {
        addToast("Work order deleted", "success");
        load();
      } else {
        addToast("Delete failed", "error");
      }
    } catch {
      addToast("Delete failed", "error");
    }
  };

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;
    const content = `
      <html>
        <head><title>Work Order ${order.work_order_number || ""}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
          <h2 style="margin-bottom: 8px;">Work Order ${order.work_order_number || ""}</h2>
          <p><strong>Product:</strong> ${order.product_name || "—"}</p>
          <p><strong>Production Order:</strong> ${order.production_order_number || "—"}</p>
          <p><strong>Customer:</strong> ${order.customer_name || "—"}</p>
          <p><strong>Machine:</strong> ${order.machine_name || "—"}</p>
          <p><strong>Planned Qty:</strong> ${order.planned_quantity ?? 0}</p>
          <p><strong>Produced Qty:</strong> ${order.produced_quantity ?? 0}</p>
          <p><strong>Status:</strong> ${woStatusLabel(order.status) || "—"}</p>
          <p><strong>Priority:</strong> ${order.priority || "—"}</p>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const exportColumns = [
    { key: "work_order_number", label: "WO No" },
    { key: "production_order_number", label: "Production Order" },
    { key: "product_name", label: "Product" },
    { key: "customer_name", label: "Customer" },
    { key: "planned_quantity", label: "Planned" },
    { key: "produced_quantity", label: "Produced" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const handleExportExcel = () => {
    exportToExcel(filteredOrders, exportColumns, "work-orders");
    addToast("Exported to Excel");
  };

  const handleExportPdf = () => {
    exportToPdf(filteredOrders, exportColumns, "Work Orders", "work-orders");
    addToast("Exported to PDF");
  };

  const columns = [
    { key: "work_order_number", label: "WO No" },
    { key: "production_order_number", label: "Production Order" },
    { key: "product_name", label: "Product" },
    { key: "customer_name", label: "Customer" },
    { key: "machine_name", label: "Machine" },
    {
      key: "planned_quantity",
      label: "Planned",
      render: (r) => r.planned_quantity ?? 0,
    },
    {
      key: "produced_quantity",
      label: "Produced",
      render: (r) => r.produced_quantity ?? 0,
    },
    {
      key: "remaining_quantity",
      label: "Remaining",
      render: (r) => r.remaining_quantity ?? Math.max((r.planned_quantity || 0) - (r.produced_quantity || 0), 0),
    },
    {
      key: "priority",
      label: "Priority",
      render: (r) => <PriorityPill priority={r.priority} />,
    },
    {
      key: "progress",
      label: "Progress",
      sortable: false,
      render: (r) => <ProgressCell row={r} />,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${r.is_delayed ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
          {r.is_delayed ? "delayed" : woStatusLabel(r.status)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (r) => (
        <div className="flex flex-wrap gap-1 text-xs">
          <button type="button" onClick={() => openOrder(r)} className="font-semibold text-[#2563EB] hover:underline">👁 View</button>
          {hasEditPermission && (
            <button type="button" onClick={() => handleDelete(r)} className="font-semibold text-red-600 hover:underline">🗑 Delete</button>
          )}
          <button type="button" onClick={() => handlePrint(r)} className="font-semibold text-purple-700 hover:underline">🖨 Print</button>
          {canWoStart(r.status) && (
            <button type="button" onClick={() => handleStartClick(r)} className="font-semibold text-green-700 hover:underline">▶ Start</button>
          )}
          {canWoPause(r.status) && (
            <button type="button" onClick={() => handlePause(r)} className="font-semibold text-amber-700 hover:underline">⏸ Pause</button>
          )}
          {canWoPause(r.status) && (
            <button type="button" onClick={() => handleStop(r)} className="font-semibold text-slate-700 hover:underline">⏹ Stop</button>
          )}
          {canWoComplete(r.status) && (
            <button type="button" onClick={() => handleComplete(r)} className="font-semibold text-teal-700 hover:underline">✅ Complete</button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Loader label="Loading work orders..." />;

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track and manage production work orders linked to planning and execution.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasEditPermission && (
            <Link to="/production/work-orders/create-quick" className="ui-btn-primary">
              <Plus className="h-4 w-4" /> New Work Order
            </Link>
          )}
          <button type="button" onClick={handleExportExcel} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export Excel
          </button>
          <button type="button" onClick={handleExportPdf} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <FileText className="h-4 w-4" /> Export PDF
          </button>
          <button type="button" onClick={() => load(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="Total Work Orders" value={summaryMetrics.total_work_orders} icon={ClipboardList} color="bg-[#2563EB]" />
        <SummaryCard label="Planned" value={summaryMetrics.planned_orders} icon={FileText} color="bg-blue-500" />
        <SummaryCard label="In Progress" value={summaryMetrics.in_progress_orders} icon={Play} color="bg-amber-500" />
        <SummaryCard label="Completed" value={summaryMetrics.completed_orders} icon={CheckCircle2} color="bg-green-500" />
        <SummaryCard label="Delayed" value={summaryMetrics.delayed_orders} icon={AlertTriangle} color="bg-red-500" />
        <SummaryCard label="High Priority" value={summaryMetrics.high_priority_orders} icon={Pause} color="bg-slate-500" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search work orders..."
            value={filters.work_order || filters.product}
            onChange={(e) => setFilters((f) => ({ ...f, work_order: e.target.value, product: e.target.value }))}
            className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            {showAdvanced ? "Hide Filters" : "Advanced Filters"}
          </button>
        </div>

        {showAdvanced && (
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <input placeholder="WO No" value={filters.work_order} onChange={(e) => setFilters((f) => ({ ...f, work_order: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder="Production Order" value={filters.production_order} onChange={(e) => setFilters((f) => ({ ...f, production_order: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder="Product" value={filters.product} onChange={(e) => setFilters((f) => ({ ...f, product: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder="Customer" value={filters.customer} onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder="Machine" value={filters.machine} onChange={(e) => setFilters((f) => ({ ...f, machine: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
            <select value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">Department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filters.shift} onChange={(e) => setFilters((f) => ({ ...f, shift: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">Shift</option>
              {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">Priority</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm">
              <option value="">Status</option>
              {Object.keys({ planned: 1, in_progress: 1, completed: 1, paused: 1, released: 1, material_ready: 1, machine_ready: 1 }).map((s) => <option key={s} value={s}>{woStatusLabel(s)}</option>)}
            </select>
            <button type="button" onClick={() => setFilters(defaultFilters)} className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Clear</button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredOrders}
          showSearch={false}
          emptyState={
            <div className="py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">No work orders found.</p>
              {hasEditPermission && (
                <Link to="/production/work-orders/create-quick" className="ui-btn-primary mt-4 inline-flex">Create Work Order</Link>
              )}
            </div>
          }
        />
      </div>

      {selected && (
        <WorkOrderDetailModal
          workOrder={selected}
          detail={detail}
          onClose={() => { setSelected(null); setDetail(null); }}
          onStart={handleStartClick}
          onPause={handlePause}
          onStop={handleStop}
          onComplete={handleComplete}
        />
      )}

      {startModal && (
        <WorkOrderStartModal
          workOrder={startModal}
          checks={startChecks}
          onClose={() => setStartModal(null)}
          onConfirm={confirmStart}
          loading={startLoading}
        />
      )}

      {completeModal && (
        <WorkOrderCompleteModal
          workOrder={completeModal}
          steps={completeSteps}
          onClose={() => setCompleteModal(null)}
        />
      )}
    </div>
  );
}
