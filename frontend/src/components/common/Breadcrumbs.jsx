import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const pathLabels = {
  "": "Dashboard",
  production: "Production",
  planning: "Production Planning",
  "work-orders": "Work Orders",
  batches: "Batch Tracking",
  machines: "Machine Status",
  reports: "Daily Reports",
  create: "Create Order",
  inventory: "Inventory",
  items: "Items",
  warehouses: "Warehouses",
  suppliers: "Suppliers",
  sales: "Sales",
  customers: "Customers",
  hr: "HR",
  employees: "Employees",
  accounts: "Accounts",
  procurement: "Procurement",
  maintenance: "Maintenance",
  quality: "Quality",
  analytics: "Analytics",
  alerts: "Alerts",
  documents: "Documents",
  admin: "Admin",
  settings: "Settings",
};

function getLabel(segment, segments, index) {
  const prev = index > 0 ? segments[index - 1] : null;
  if (segment === "create" && prev === "items") return "Create Item";
  if (segment === "create" && prev === "warehouses") return "Create Warehouse";
  if (segment === "create" && prev === "suppliers") return "Create Supplier";
  if (segment === "create") return "Create Order";
  return pathLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({ items: customItems }) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const items = customItems ?? [
    { label: "Dashboard", path: "/" },
    ...segments.map((seg, i) => ({
      label: getLabel(seg, segments, i),
      path: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 mb-4">
      {items.map((item, i) => (
        <span key={item.path + i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
          {i === items.length - 1 ? (
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {i === 0 ? <Home className="h-4 w-4 inline" /> : item.label}
            </span>
          ) : (
            <Link to={item.path} className="hover:text-teal-600 transition-colors flex items-center gap-1">
              {i === 0 ? <Home className="h-4 w-4" /> : item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
