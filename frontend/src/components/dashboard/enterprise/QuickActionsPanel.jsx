import { Link } from "react-router-dom";

<<<<<<< HEAD
import { quickActions } from "../../../data/dashboardDummyData";
import DashboardIcon from "./DashboardIcons";

=======
import DashboardIcon from "./DashboardIcons";

const quickActions = [
  { label: "Create Work Order", icon: "Assignment", to: "/production/work-orders/create-quick", color: "#2563EB" },
  { label: "Material Issue", icon: "Inventory", to: "/inventory/stock-movement", color: "#22C55E" },
  { label: "Production Entry", icon: "Factory", to: "/production/create", color: "#8B5CF6" },
  { label: "QC Entry", icon: "FactCheck", to: "/quality/inspection", color: "#0EA5E9" },
  { label: "Purchase Order", icon: "ShoppingCart", to: "/procurement/purchase-orders/create", color: "#F59E0B" },
  { label: "Sales Order", icon: "Receipt", to: "/sales/orders/create", color: "#EC4899" },
  { label: "Reports", icon: "Assessment", to: "/analytics/production", color: "#6366F1" },
  { label: "Settings", icon: "Settings", to: "/settings", color: "#64748B" },
];

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
export default function QuickActionsPanel() {
  return (
    <section className="rounded-2xl border border-slate-100/80 bg-white/90 p-5 shadow-[0_4px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6">
      <h3 className="mb-4 text-base font-bold text-[#0F172A]">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg"
            style={{ ["--action-color"]: action.color }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: action.color }}
            >
              <DashboardIcon name={action.icon} />
            </span>
            <span className="text-[11px] font-semibold leading-tight text-slate-700 group-hover:text-[#0F172A]">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
