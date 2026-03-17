import { useState } from "react";

const TAX_RATES = [0, 0.1, 0.25, 3, 5, 6, 12, 18, 28, 40];

export default function SettingsTaxOptions() {
  const [enabled, setEnabled] = useState(
    Object.fromEntries(TAX_RATES.map((r) => [r, true]))
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-600"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Tax Options
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Please select taxes applicable for your sales and purchase transactions.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50">
        {TAX_RATES.map((rate) => (
          <div
            key={rate}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700/50"
          >
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Tax: {rate}%
            </span>
            <Toggle
              checked={enabled[rate] ?? false}
              onChange={(v) => setEnabled((prev) => ({ ...prev, [rate]: v }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
