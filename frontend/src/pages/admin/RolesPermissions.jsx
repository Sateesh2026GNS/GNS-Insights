import { ROLES, ROLE_PERMISSIONS } from "../../config/permissions";

const MODULE_LABELS = {
  dashboard: "Dashboard",
  production: "Production",
  inventory: "Inventory",
  procurement: "Procurement",
  hr: "HR & Employees",
  sales: "Sales & Billing",
  accounts: "Accounts & Reports",
  quality: "Quality Control",
  maintenance: "Maintenance",
  analytics: "Analytics",
  alerts: "Alerts & Notifications",
  admin: "Security & Roles",
  documents: "Documents",
};

export default function RolesPermissions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Security & Roles</h1>
      <p className="mt-1 text-slate-500">
        Each role sees different screens. Assign roles to users to control access.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
          >
            <h3 className="font-semibold text-slate-800">{role.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{role.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(ROLE_PERMISSIONS[role.name] || []).map((mod) => (
                <span
                  key={mod}
                  className="inline-flex rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                >
                  {MODULE_LABELS[mod] || mod}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Tip</p>
        <p className="mt-1 text-sm text-amber-700">
          Use Demo Login to switch roles and see how each role sees different sidebar menus.
        </p>
      </div>
    </div>
  );
}
