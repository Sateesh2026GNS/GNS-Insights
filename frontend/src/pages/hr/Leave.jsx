import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Check, CheckCircle, Clock, Plus, RefreshCw, X, XCircle, Save } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import RowActionMenu from "../../components/common/RowActionMenu";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getLeaveEnriched, getLeaveSummary, updateLeaveRequest, getEmployees, createLeaveRequest } from "../../api/hrApi";
import { DEMO_LEAVE_LIST, DEMO_LEAVE_SUMMARY, LEAVE_TYPES, statusColor } from "../../data/hrMasterData";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}</p></div>
        {Icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>}
      </div>
    </div>
  );
}

export default function Leave() {
  const tenantId = useTenantId();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(DEMO_LEAVE_SUMMARY);
  const [rows, setRows] = useState(DEMO_LEAVE_LIST);
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState("table");
  const [openMenu, setOpenMenu] = useState(null);
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    leave_type: "casual",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, listRes, empRes] = await Promise.allSettled([
        getLeaveSummary(),
        getLeaveEnriched(),
        getEmployees(),
      ]);
      if (sumRes.status === "fulfilled" && sumRes.value?.data) setSummary({ ...DEMO_LEAVE_SUMMARY, ...sumRes.value.data });
      if (listRes.status === "fulfilled" && listRes.value?.data?.length) setRows(listRes.value.data);
      else setRows(DEMO_LEAVE_LIST);
      if (empRes.status === "fulfilled") setEmployees(empRes.value?.data || []);
    } catch {
      addToast("Using demo leave data", "info");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!statusFilter) return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const handleStatus = async (id, status) => {
    if (typeof id === "number") {
      try {
        await updateLeaveRequest(id, { status });
        addToast(`Leave ${status}`);
        load();
      } catch (err) {
        addToast(err.response?.data?.detail || "Update failed", "error");
      }
    } else {
      addToast(`Leave ${status} (demo)`);
      load();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.start_date || !form.end_date) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createLeaveRequest({
        employee_id: Number(form.employee_id),
        leave_type: form.leave_type,
        start_date: form.start_date,
        end_date: form.end_date,
        reason: form.reason.trim() || null,
        status: "pending",
      });
      addToast("Leave request submitted successfully", "success");
      setShowCreateModal(false);
      setForm({
        employee_id: "",
        leave_type: "casual",
        start_date: "",
        end_date: "",
        reason: "",
      });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit leave request.");
      addToast("Failed to submit leave request", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "employee_name", label: "Employee" },
    { key: "leave_type", label: "Type", render: (r) => <span className="capitalize">{r.leave_type?.replace("_", " ")}</span> },
    { key: "start_date", label: "From" },
    { key: "end_date", label: "To" },
    { key: "days", label: "Days" },
    { key: "reason", label: "Reason", render: (r) => r.reason || "—" },
    { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColor(r.status)}`}>{r.status}</span> },
    { key: "actions", label: "Actions", sortable: false, render: (r) => r.status === "pending" ? (
      <RowActionMenu
        rowId={r.id}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        items={[
          { label: "Approve", icon: <Check className="h-4 w-4" />, onClick: () => handleStatus(r.id, "approved") },
          { label: "Reject", icon: <X className="h-4 w-4" />, onClick: () => handleStatus(r.id, "rejected"), danger: true },
        ]}
      />
    ) : "—" },
  ];

  if (loading && rows.length === 0) return <Loader label="Loading leave requests..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="mt-1 text-sm text-slate-500">Leave calendar, multi-level approval workflow, and balance tracking.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="ui-btn-primary inline-flex items-center gap-1.5 animate-none"
        >
          <Plus className="h-4 w-4" /> Request Leave
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <KpiCard label="Pending" value={summary.pending_leave} icon={Clock} color="bg-amber-500" />
        <KpiCard label="Approved" value={summary.approved} icon={CheckCircle} color="bg-green-600" />
        <KpiCard label="Rejected" value={summary.rejected} icon={XCircle} color="bg-red-500" />
        <KpiCard label="Available" value={summary.available_leave} icon={Calendar} color="bg-blue-600" />
        <KpiCard label="Sick Leave" value={summary.sick_leave} icon={Calendar} color="bg-orange-500" />
        <KpiCard label="Casual" value={summary.casual_leave} icon={Calendar} color="bg-indigo-600" />
        <KpiCard label="Earned" value={summary.earned_leave} icon={Calendar} color="bg-teal-600" />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
        {["Employee", "Manager", "HR", "Approved"].map((s, i, arr) => (
          <span key={s} className="flex items-center gap-2">
            <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{s}</span>
            {i < arr.length - 1 && <span className="text-slate-400">↓</span>}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All Status</option>
          {["pending", "approved", "rejected"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
          <button type="button" onClick={() => setView("table")} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${view === "table" ? "bg-white text-[#2563EB] shadow-sm" : "text-slate-500"}`}>Table</button>
          <button type="button" onClick={() => setView("calendar")} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${view === "calendar" ? "bg-white text-[#2563EB] shadow-sm" : "text-slate-500"}`}>Calendar</button>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>

      {view === "table" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <DataTable columns={columns} data={filtered} searchPlaceholder="Search employee, type..." searchKeys={["employee_name", "leave_type"]} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">July 2026 — Leave Calendar</h2>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-2 font-semibold text-slate-500">{d}</div>)}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const hasLeave = filtered.some((l) => {
                const s = new Date(l.start_date).getDate();
                const e = new Date(l.end_date).getDate();
                return day >= s && day <= e;
              });
              return (
                <div key={day} className={`rounded-lg py-2 ${hasLeave ? "bg-amber-100 font-semibold text-amber-800" : "text-slate-600"}`}>{day}</div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {LEAVE_TYPES.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">{t.replace("_", " ")}</span>)}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request Leave</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submit a new leave request to the workflow.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Employee *</label>
                <select
                  value={form.employee_id}
                  onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.full_name} ({e.employee_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Type *</label>
                <select
                  value={form.leave_type}
                  onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {LEAVE_TYPES.map((t) => (
                    <option key={t} value={t} className="capitalize">{t.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">End Date *</label>
                  <input
                    type="date"
                    required
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</label>
                <textarea
                  rows="3"
                  placeholder="Describe the reason for leave..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Request Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
