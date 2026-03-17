import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { canAccess } from "../../config/permissions";

const emojiMap = {
  dashboard: "📋",
  production: "🏭",
  inventory: "📦",
  procurement: "🛒",
  hr: "👥",
  sales: "💰",
  accounts: "📒",
  quality: "✅",
  maintenance: "🔧",
  analytics: "📊",
  alerts: "🔔",
  admin: "🔐",
  documents: "📄",
  factory: "📺",
  iot: "📡",
};

// Simplified: max 3 items per section, trimmed to essentials
const navSections = [
  { labelKey: "nav.dashboard", module: "dashboard", icon: "dashboard", to: "/", items: [] },
  { labelKey: "nav.productionManagement", module: "production", icon: "production", collapsible: true, items: [
    { labelKey: "nav.productionDashboard", to: "/production" },
    { labelKey: "nav.workOrders", to: "/production/work-orders" },
    { labelKey: "nav.productionPlanning", to: "/production/planning" },
    { labelKey: "nav.machineStatus", to: "/production/machines" },
  ]},
  { labelKey: "nav.inventoryManagement", module: "inventory", icon: "inventory", collapsible: true, items: [
    { labelKey: "nav.rawMaterialTracking", to: "/inventory/items" },
    { labelKey: "nav.warehouseManagement", to: "/inventory/warehouses" },
    { labelKey: "nav.lowStockAlerts", to: "/inventory" },
  ]},
  { labelKey: "nav.procurementManagement", module: "procurement", icon: "procurement", collapsible: true, items: [
    { labelKey: "nav.purchaseOrders", to: "/procurement/purchase-orders" },
    { labelKey: "nav.vendorManagement", to: "/procurement/vendors" },
    { labelKey: "nav.goodsReceipt", to: "/procurement/goods-receipt" },
  ]},
  { labelKey: "nav.hrManagement", module: "hr", icon: "hr", collapsible: true, items: [
    { labelKey: "nav.workerAttendance", to: "/hr/attendance" },
    { labelKey: "nav.payroll", to: "/hr/payroll" },
    { labelKey: "nav.shiftManagement", to: "/hr/shifts" },
  ]},
  { labelKey: "nav.salesBilling", module: "sales", icon: "sales", collapsible: true, items: [
    { labelKey: "nav.salesOrders", to: "/sales/orders" },
    { labelKey: "nav.invoiceGeneration", to: "/sales/invoices" },
    { labelKey: "nav.customerManagement", to: "/sales/customers" },
  ]},
  { labelKey: "nav.accountsReports", module: "accounts", icon: "accounts", collapsible: true, items: [
    { labelKey: "nav.profitLoss", to: "/accounts/profit-loss" },
    { labelKey: "nav.expenseTracking", to: "/accounts/expenses" },
    { labelKey: "nav.exportExcelPdf", to: "/accounts" },
  ]},
  { labelKey: "nav.qualityControl", module: "quality", icon: "quality", collapsible: true, items: [
    { labelKey: "nav.qualityInspection", to: "/quality/inspection" },
    { labelKey: "nav.defectTracking", to: "/quality/defects" },
  ]},
  { labelKey: "nav.maintenance", module: "maintenance", icon: "maintenance", collapsible: true, items: [
    { labelKey: "nav.machineMaintenance", to: "/maintenance/machines" },
    { labelKey: "nav.preventiveMaintenance", to: "/maintenance/preventive" },
  ]},
  { labelKey: "nav.analytics", module: "analytics", icon: "analytics", collapsible: true, items: [
    { labelKey: "nav.productionAnalytics", to: "/analytics/production" },
    { labelKey: "nav.machineEfficiency", to: "/analytics/machine-efficiency" },
  ]},
  { labelKey: "nav.alertsNotifications", module: "alerts", icon: "alerts", collapsible: true, items: [
    { labelKey: "nav.allAlerts", to: "/alerts" },
    { labelKey: "nav.lowStockAlertsTitle", to: "/alerts/low-stock" },
  ]},
  { labelKey: "nav.securityRoles", module: "admin", icon: "admin", collapsible: true, items: [
    { labelKey: "nav.roles", to: "/admin/roles" },
    { labelKey: "nav.userManagement", to: "/settings/users" },
  ]},
  { labelKey: "nav.documents", module: "documents", icon: "documents", collapsible: true, items: [
    { labelKey: "nav.reportsArchive", to: "/documents/reports" },
    { labelKey: "nav.purchaseDocuments", to: "/documents/purchase" },
  ]},
  { labelKey: "nav.factoryMonitor", module: "factoryMonitor", icon: "factory", collapsible: true, items: [
    { labelKey: "nav.liveProduction", to: "/factory-monitor/live-production" },
    { labelKey: "nav.machineStatus", to: "/factory-monitor/machine-status" },
  ]},
  { labelKey: "nav.iotSmartFactory", module: "iot", icon: "iot", collapsible: true, items: [
    { labelKey: "nav.iotDashboard", to: "/iot" },
    { labelKey: "nav.machineAnalytics", to: "/iot/machine-analytics" },
    { labelKey: "nav.iotSensors", to: "/iot/sensors" },
  ]},
];

export default function Sidebar({ collapsed, onCollapse, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const role = user?.role || "Operator";

  const [openSections, setOpenSections] = useState({
    "nav.productionManagement": true,
    "nav.inventoryManagement": true,
    "nav.procurementManagement": false,
    "nav.hrManagement": false,
    "nav.salesBilling": false,
    "nav.accountsReports": false,
    "nav.qualityControl": false,
    "nav.maintenance": false,
    "nav.analytics": false,
    "nav.alertsNotifications": false,
    "nav.securityRoles": false,
    "nav.documents": false,
    "nav.factoryMonitor": false,
    "nav.iotSmartFactory": false,
  });

  const visibleSections = navSections.filter((s) => !s.module || canAccess(role, s.module));

  const toggleSection = (labelKey) => {
    setOpenSections((prev) => ({ ...prev, [labelKey]: !prev[labelKey] }));
  };

  const navLinkClass = (isActive) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
      isActive
        ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-medium"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
    }`;

  return (
    <aside className="flex h-full flex-col shrink-0 overflow-hidden border-r border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-all duration-300">
      <div className={`shrink-0 border-b border-slate-100 dark:border-slate-800 ${collapsed ? "p-2" : "p-4"}`}>
        <Link to="/" className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-sm shadow-md">
            S
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-slate-900 dark:text-white truncate">SMRT</span>
          )}
        </Link>
      </div>

      <nav className={`sidebar-scroll flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden ${collapsed ? "p-2" : "p-3"}`}>
        {visibleSections.map((section) => {
          const emoji = emojiMap[section.icon];

          if (section.to) {
            return (
              <NavLink
                key={section.labelKey}
                to={section.to}
                onClick={() => onClose?.()}
                title={collapsed ? t(section.labelKey) : undefined}
                className={({ isActive }) =>
                  `${navLinkClass(isActive)} ${collapsed ? "justify-center px-2 py-2.5" : ""}`
                }
              >
                {emoji && <span className="text-base leading-none shrink-0" aria-hidden>{emoji}</span>}
                {!collapsed && <span className="truncate">{t(section.labelKey)}</span>}
              </NavLink>
            );
          }

          if (collapsed) {
            return (
              <div key={section.labelKey} className="relative group">
                <button
                  type="button"
                  onClick={() => toggleSection(section.labelKey)}
                  title={t(section.labelKey)}
                  className="flex w-full items-center justify-center px-2 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {emoji && <span className="text-base leading-none">{emoji}</span>}
                </button>
                {openSections[section.labelKey] && section.items?.length > 0 && (
                  <div className="absolute left-full top-0 ml-1 py-1 min-w-[180px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => onClose?.()}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm rounded-lg mx-1 ${isActive ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`
                        }
                      >
                        {t(item.labelKey)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={section.labelKey} className="py-1">
              <button
                type="button"
                onClick={() => toggleSection(section.labelKey)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  {emoji && <span className="text-base leading-none shrink-0" aria-hidden>{emoji}</span>}
                  <span className="truncate">{t(section.labelKey)}</span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openSections[section.labelKey] ? "rotate-180" : ""}`} />
              </button>
              {openSections[section.labelKey] && section.items?.length > 0 && (
                <ul className="mt-0.5 ml-4 pl-3 border-l border-slate-200 dark:border-slate-700 space-y-0.5 animate-[fadeIn_0.2s_ease-out]">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => onClose?.()}
                        className={({ isActive }) => navLinkClass(isActive)}
                      >
                        <span className="truncate">{t(item.labelKey)}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 p-2 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
        <button
          type="button"
          onClick={() => onCollapse?.()}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
