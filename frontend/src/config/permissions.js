/**
 * Role-based permissions. Each role sees different modules/screens.
 * Module codes map to sidebar sections and routes.
 */
export const ROLES = [
  { id: "admin", name: "Admin", description: "Full system access" },
  { id: "production_manager", name: "Production Manager", description: "Production, inventory, quality, maintenance" },
  { id: "store_manager", name: "Store Manager", description: "Inventory and procurement" },
  { id: "hr_manager", name: "HR Manager", description: "HR and employee management" },
  { id: "accountant", name: "Accountant", description: "Accounts, sales, procurement" },
  { id: "operator", name: "Operator", description: "Shop-floor production access" },
];

/** Module codes that each role can access. Admin has all. */
export const ROLE_PERMISSIONS = {
  Admin: ["dashboard", "production", "inventory", "procurement", "hr", "sales", "accounts", "quality", "maintenance", "analytics", "alerts", "admin", "documents", "factoryMonitor", "iot"],
  "Production Manager": ["dashboard", "production", "inventory", "quality", "maintenance", "analytics", "alerts", "factoryMonitor", "iot"],
  "Store Manager": ["dashboard", "inventory", "procurement", "alerts"],
  "HR Manager": ["dashboard", "hr"],
  Accountant: ["dashboard", "accounts", "sales", "procurement", "documents"],
  Operator: ["dashboard", "production", "factoryMonitor", "iot"],
};

/** Routes that require specific modules. Path prefix -> module. */
export const ROUTE_MODULES = {
  "/": "dashboard",
  "/production": "production",
  "/inventory": "inventory",
  "/procurement": "procurement",
  "/hr": "hr",
  "/sales": "sales",
  "/accounts": "accounts",
  "/quality": "quality",
  "/maintenance": "maintenance",
  "/analytics": "analytics",
  "/alerts": "alerts",
  "/admin": "admin",
  "/settings": "admin",
  "/documents": "documents",
  "/factory-monitor": "factoryMonitor",
  "/iot": "iot",
};

export function getModuleForPath(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  const sorted = Object.keys(ROUTE_MODULES).sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (path === prefix || path.startsWith(prefix + "/")) {
      return ROUTE_MODULES[prefix];
    }
  }
  return "dashboard";
}

export function canAccess(userRole, module) {
  if (!userRole) return false;
  const perms = ROLE_PERMISSIONS[userRole];
  if (!perms) return false;
  return perms.includes(module) || perms.includes("*");
}
