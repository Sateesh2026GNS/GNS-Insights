import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import { createMachine } from "../../api/productionApi";
import useTenantId from "../../hooks/useTenantId";



const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

const STATUSES = ["idle", "running", "down", "maintenance"];

export default function CreateMachine() {
  const tenantId = useTenantId();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenant_id: tenantId,
    code: "",
    name: "",
    status: "idle",
    location: "",
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createMachine({
        ...form,
        code: form.code.trim(),
        name: form.name.trim(),
        location: form.location.trim() || null,
      });
      navigate("/production/machines");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl text-left">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">{t("production.newMachine", { defaultValue: "New machine" })}</h2>
          <Link
            to="/production/machines"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <XCircle className="h-5 w-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">
              {t("production.machineCode", { defaultValue: "Machine code" })} *
            </label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="e.g. CNC-01"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">
              {t("production.machineName", { defaultValue: "Name" })} *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. CNC Mill 1"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                {t("dashboard.status", { defaultValue: "Status" })}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm bg-white font-medium text-slate-700"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">
                {t("production.location", { defaultValue: "Location" })}
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder={t("production.locationPlaceholder", { defaultValue: "e.g. Hall A" })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              {t("production.machineActive", { defaultValue: "Active" })}
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Link
              to="/production/machines"
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? t("common.saving", { defaultValue: "Saving…" }) : t("production.addMachine", { defaultValue: "Add machine" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}