import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";

const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Main",
    address: "Main Address, Mumbai, (Maharashtra - 27), India - 400001",
    type: "Regular",
  },
];

export default function SettingsDeliveryLocation() {
  const [locations] = useState(MOCK_LOCATIONS);
  const [menuOpen, setMenuOpen] = useState(null);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Delivery Location
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            This is a list of your delivery locations
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border-2 border-teal-600 bg-white px-4 py-2.5 text-sm font-medium text-teal-600 hover:bg-teal-50 dark:border-teal-500 dark:bg-slate-800 dark:text-teal-400 dark:hover:bg-teal-900/20"
        >
          <Plus className="h-4 w-4" />
          Add Delivery Location
        </button>
      </div>

      {/* Location list */}
      <div className="space-y-4">
        {locations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500 dark:border-slate-700">
            No delivery locations yet. Add one to get started.
          </div>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {loc.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {loc.address}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    Type: {loc.type}
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(menuOpen === loc.id ? null : loc.id)}
                    className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                    aria-label="Options"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {menuOpen === loc.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        aria-hidden="true"
                        onClick={() => setMenuOpen(null)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
