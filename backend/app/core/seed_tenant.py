"""Ensure default tenant exists."""


def seed_tenant(db):
    """Create tenant 1 (Acme Manufacturing) if it doesn't exist."""
    from sqlalchemy import select

    from app.models.tenant import Tenant

    existing = db.scalars(select(Tenant).where(Tenant.id == 1)).first()
    if existing:
        return

    tenant = Tenant(id=1, name="Acme Manufacturing", slug="acme")
    db.add(tenant)
    db.commit()
