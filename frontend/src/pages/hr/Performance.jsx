<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../../components/common/Loader";
import Table from "../../components/common/Table";
import { getPerformanceReviews, getEmployees } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";



export default function Performance() {
  const tenantId = useTenantId();
=======
import { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, RefreshCw, X, Save, Star, Award, TrendingUp, Users } from "lucide-react";

import DataTable from "../../components/common/DataTable";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import { getPerformanceReviews, getEmployees, createPerformanceReview } from "../../api/hrApi";
import useTenantId from "../../hooks/useTenantId";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      </div>
      {Icon && (
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}

export default function Performance() {
  const tenantId = useTenantId();
  const { addToast } = useToast();
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);

<<<<<<< HEAD
  useEffect(() => {
    Promise.all([
      getPerformanceReviews(tenantId),
      getEmployees(tenantId),
    ])
      .then(([revRes, empRes]) => {
        setReviews(revRes.data || []);
        setEmployees(empRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading performance reviews..." />;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Performance Tracking</h2>
        <Link to="/hr/performance/create">Create Review</Link>
      </div>
      <div style={{ background: "#fff", padding: "16px", borderRadius: "10px" }}>
        <Table
          columns={[
            {
              key: "employee_id",
              label: "Employee",
              render: (r) => {
                const e = employees.find((x) => x.id === r.employee_id);
                return e?.full_name ?? r.employee_id;
              },
            },
            { key: "review_period", label: "Period" },
            { key: "rating", label: "Rating" },
            { key: "productivity_score", label: "Productivity" },
            {
              key: "goals",
              label: "Goals",
              render: (r) =>
                r.goals_achieved != null && r.goals_total != null
                  ? `${r.goals_achieved}/${r.goals_total}`
                  : "-",
            },
            { key: "notes", label: "Notes" },
          ]}
          data={reviews}
        />
      </div>
=======
  // Modal form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenant_id: tenantId,
    employee_id: "",
    review_period: "",
    rating: "5",
    productivity_score: "90",
    goals_achieved: "5",
    goals_total: "5",
    notes: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, empRes] = await Promise.all([
        getPerformanceReviews(tenantId),
        getEmployees(tenantId),
      ]);
      setReviews(revRes.data || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      addToast("Failed to load performance metrics", "error");
    } finally {
      setLoading(false);
    }
  }, [tenantId, addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpis = useMemo(() => {
    const total = reviews.length;
    const avgRating =
      total > 0
        ? (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / total).toFixed(1)
        : "0.0";
    const avgProductivity =
      total > 0
        ? Math.round(reviews.reduce((acc, curr) => acc + (curr.productivity_score || 0), 0) / total)
        : 0;
    return { total, avgRating, avgProductivity };
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.review_period) {
      setError("Employee and Review Period are required fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createPerformanceReview({
        ...form,
        employee_id: Number(form.employee_id),
        rating: form.rating ? Number(form.rating) : null,
        productivity_score: form.productivity_score ? Number(form.productivity_score) : null,
        goals_achieved: form.goals_achieved ? Number(form.goals_achieved) : null,
        goals_total: form.goals_total ? Number(form.goals_total) : null,
      });
      addToast("Performance review created successfully", "success");
      setShowCreateModal(false);
      // Reset form
      setForm({
        tenant_id: tenantId,
        employee_id: "",
        review_period: "",
        rating: "5",
        productivity_score: "90",
        goals_achieved: "5",
        goals_total: "5",
        notes: "",
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create performance review.");
      addToast("Failed to save performance review", "error");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "employee_id",
      label: "Employee",
      render: (r) => {
        const e = employees.find((x) => x.id === r.employee_id);
        return <span className="font-semibold text-slate-900">{e?.full_name ?? `ID: ${r.employee_id}`}</span>;
      },
    },
    { key: "review_period", label: "Review Period", render: (r) => <span className="text-slate-700">{r.review_period}</span> },
    {
      key: "rating",
      label: "Rating",
      render: (r) => (
        <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          {r.rating || 0}/5
        </span>
      ),
    },
    {
      key: "productivity_score",
      label: "Productivity",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-12 bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${r.productivity_score || 0}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-700">{r.productivity_score || 0}%</span>
        </div>
      ),
    },
    {
      key: "goals",
      label: "Goals Achieved",
      render: (r) =>
        r.goals_achieved != null && r.goals_total != null ? (
          <span className="text-xs font-medium text-slate-700 bg-slate-100 rounded-lg px-2 py-1 border">
            {r.goals_achieved} of {r.goals_total}
          </span>
        ) : (
          "—"
        ),
    },
    { key: "notes", label: "Evaluator Notes", render: (r) => <span className="text-xs text-slate-500 max-w-xs block truncate" title={r.notes}>{r.notes || "—"}</span> },
  ];

  if (loading && reviews.length === 0) return <Loader label="Loading reviews log..." />;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Performance Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">Conduct employee reviews, track target goals achievement, and audit organizational productivity.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all animate-none"
          >
            <Plus className="h-4 w-4" /> Create Review
          </button>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total Reviews Conducted" value={kpis.total} icon={Users} color="bg-blue-600" />
        <KpiCard label="Average Appraisal Rating" value={`${kpis.avgRating} / 5.0`} icon={Star} color="bg-amber-500" />
        <KpiCard label="Average Productivity Score" value={`${kpis.avgProductivity}%`} icon={TrendingUp} color="bg-green-600" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataTable
          columns={columns}
          data={reviews}
          searchPlaceholder="Search reviews by period, notes..."
          searchKeys={["review_period", "notes"]}
        />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Performance Review</h3>
                <p className="text-xs text-slate-500 mt-0.5">Evaluate employee KPI metrics and targets alignment.</p>
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Review Period *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 2026, Mid-Year 2026"
                  value={form.review_period}
                  onChange={(e) => setForm({ ...form, review_period: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Productivity (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.productivity_score}
                    onChange={(e) => setForm({ ...form, productivity_score: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Goals Achieved</label>
                  <input
                    type="number"
                    min="0"
                    value={form.goals_achieved}
                    onChange={(e) => setForm({ ...form, goals_achieved: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Total Targets</label>
                  <input
                    type="number"
                    min="0"
                    value={form.goals_total}
                    onChange={(e) => setForm({ ...form, goals_total: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluator Notes</label>
                <textarea
                  rows="3"
                  placeholder="Appraisal details, achievement milestones, areas of growth..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  disabled={saving || !form.employee_id}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Create Review"}
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