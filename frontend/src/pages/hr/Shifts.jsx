<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import Table from "../../components/common/Table";
import { getShifts } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";


=======
import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, X, Save, Users } from "lucide-react";

import Loader from "../../components/common/Loader";
import Table from "../../components/common/Table";
import { getShifts, createShift, getEmployees } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";
import { useToast } from "../../context/ToastContext";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8

function formatTime(t) {
  if (!t) return "-";
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

export default function Shifts() {
  const tenantId = useTenantId();
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    getShifts(tenantId)
      .then((r) => setShifts(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading shifts..." />;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Shift Management</h2>
        <Link to="/hr/shifts/create">Create Shift</Link>
      </div>
      <div style={{ background: "#fff", padding: "16px", borderRadius: "10px" }}>
        <Table
          columns={[
            { key: "name", label: "Name" },
            {
              key: "start_time",
              label: "Start",
=======
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    tenant_id: tenantId,
    name: "",
    start_time: "08:00",
    end_time: "16:00",
    break_minutes: "60",
    capacity_hours: "8.0",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [shiftRes, empRes] = await Promise.all([
        getShifts(tenantId),
        getEmployees(),
      ]);
      setShifts(shiftRes.data || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      addToast("Failed to load shifts", "error");
    } finally {
      setLoading(false);
    }
  }, [tenantId, addToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.start_time || !form.end_time) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createShift({
        ...form,
        tenant_id: tenantId,
        break_minutes: Number(form.break_minutes) || 0,
        capacity_hours: Number(form.capacity_hours) || 8.0,
      });
      addToast("Shift created successfully", "success");
      setShowCreateModal(false);
      // Reset form
      setForm({
        tenant_id: tenantId,
        name: "",
        start_time: "08:00",
        end_time: "16:00",
        break_minutes: "60",
        capacity_hours: "8.0",
      });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create shift.");
      addToast("Failed to create shift", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading && shifts.length === 0) return <Loader label="Loading shifts registry..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Shift Management</h1>
          <p className="mt-1 text-sm text-slate-500">Configure employee shift schedules, capacity parameters, and break planning.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Create Shift
          </button>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Table
          columns={[
            { key: "name", label: "Shift Name", render: (r) => <span className="font-semibold text-slate-900">{r.name}</span> },
            {
              key: "start_time",
              label: "Start Time",
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
              render: (r) => formatTime(r.start_time),
            },
            {
              key: "end_time",
<<<<<<< HEAD
              label: "End",
              render: (r) => formatTime(r.end_time),
            },
            { key: "break_minutes", label: "Break (min)" },
            { key: "capacity_hours", label: "Capacity (h)" },
=======
              label: "End Time",
              render: (r) => formatTime(r.end_time),
            },
            { key: "break_minutes", label: "Break (mins)" },
            { key: "capacity_hours", label: "Capacity (hrs)" },
            {
              key: "assigned_employees",
              label: "Assigned Employees",
              render: (r) => {
                const assigned = employees.filter(
                  (e) => (e.shift_name || e.shift || "").toLowerCase() === r.name.toLowerCase()
                );
                return assigned.length > 0 ? (
                  <span className="text-slate-700 font-semibold text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border flex items-center gap-1 w-fit">
                    <Users className="h-3 w-3 text-slate-400" />
                    {assigned.map((e) => e.full_name).join(", ")}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">No employees assigned</span>
                );
              },
            },
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          ]}
          data={shifts}
        />
      </div>
<<<<<<< HEAD
=======

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Shift</h3>
                <p className="text-xs text-slate-500 mt-0.5">Define a work shift with name, timings, and breaks.</p>
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Shift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day Shift, Night Shift"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Break (mins)</label>
                  <input
                    type="number"
                    value={form.break_minutes}
                    onChange={(e) => setForm({ ...form, break_minutes: e.target.value })}
                    min="0"
                    placeholder="e.g. 60"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.capacity_hours}
                    onChange={(e) => setForm({ ...form, capacity_hours: e.target.value })}
                    placeholder="e.g. 8.0"
                    className={inputClass}
                  />
                </div>
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
                  {saving ? "Saving..." : "Create Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    </div>
  );
}