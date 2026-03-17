"""Seed default admin user for tenant 1 if no users exist."""


def seed_admin_user(db):
    from sqlalchemy import select

    from app.models.role import Role
    from app.models.user import User, user_roles
    from app.services.auth_service import hash_password

    count = db.scalars(select(User).limit(1)).first()
    if count:
        return

    admin_role = db.scalars(
        select(Role).where(Role.tenant_id == 1, Role.name == "Admin")
    ).first()
    if not admin_role:
        return

    user = User(
        tenant_id=1,
        email="admin@smrt.local",
        full_name="Admin",
        hashed_password=hash_password("admin123"),
        is_active=True,
    )
    db.add(user)
    db.flush()
    db.execute(user_roles.insert().values(user_id=user.id, role_id=admin_role.id))
    db.commit()
