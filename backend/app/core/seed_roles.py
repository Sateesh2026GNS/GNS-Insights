"""Seed default roles with permissions for tenant 1."""

# Module codes mapped to sidebar sections
MODULES = [
    "dashboard",
    "production",
    "inventory",
    "procurement",
    "hr",
    "sales",
    "accounts",
    "quality",
    "maintenance",
    "analytics",
    "alerts",
    "admin",
    "documents",
]

DEFAULT_ROLES = [
    {
        "name": "Admin",
        "description": "Full system access. Can manage all modules and security.",
        "permissions": MODULES,  # All modules
    },
    {
        "name": "Production Manager",
        "description": "Oversees production, inventory, quality, maintenance, and analytics.",
        "permissions": ["dashboard", "production", "inventory", "quality", "maintenance", "analytics", "alerts"],
    },
    {
        "name": "Store Manager",
        "description": "Manages inventory, warehouses, and procurement.",
        "permissions": ["dashboard", "inventory", "procurement", "alerts"],
    },
    {
        "name": "HR Manager",
        "description": "Manages employees, attendance, payroll, and performance.",
        "permissions": ["dashboard", "hr"],
    },
    {
        "name": "Accountant",
        "description": "Access to accounts, sales, procurement for financial operations.",
        "permissions": ["dashboard", "accounts", "sales", "procurement", "documents"],
    },
    {
        "name": "Operator",
        "description": "Shop-floor access: production work orders, batches, machine status.",
        "permissions": ["dashboard", "production"],
    },
]


def seed_roles(db):
    """Ensure default roles exist for tenant 1."""
    from sqlalchemy import select

    from app.models.role import Role

    stmt = select(Role).where(Role.tenant_id == 1)
    existing = {r.name for r in db.scalars(stmt).all()}
    for r in DEFAULT_ROLES:
        if r["name"] not in existing:
            role = Role(
                tenant_id=1,
                name=r["name"],
                description=r["description"],
                permissions=r["permissions"],
            )
            db.add(role)
            existing.add(r["name"])
    db.commit()
