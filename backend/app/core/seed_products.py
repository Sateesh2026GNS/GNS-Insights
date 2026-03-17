"""Seed sample products for tenant 1."""


def seed_products(db):
    """Create sample products if none exist for tenant 1."""
    from sqlalchemy import select

    from app.models.product import Product

    stmt = select(Product).where(Product.tenant_id == 1)
    existing = list(db.scalars(stmt).all())
    if existing:
        return

    samples = [
        {"sku": "WIDGET-001", "name": "Widget A", "description": "Standard widget"},
        {"sku": "WIDGET-002", "name": "Widget B", "description": "Premium widget"},
        {"sku": "PART-101", "name": "Component X", "description": "Raw component"},
    ]
    for s in samples:
        p = Product(tenant_id=1, sku=s["sku"], name=s["name"], description=s["description"])
        db.add(p)
    db.commit()
