from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.models.role import Role
from app.models.user import User
from app.schemas.admin import AccessLogCreate, AccessLogRead
from app.services.admin_service import create_access_log, list_access_logs

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
):
    stmt = select(User).where(User.tenant_id == tenant_id).options(selectinload(User.roles))
    users = list(db.scalars(stmt).all())
    result = []
    for u in users:
        role_name = u.roles[0].name if u.roles else "—"
        result.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "phone": getattr(u, "phone", None) or "—",
            "team": role_name,
            "is_active": u.is_active,
        })
    return result


@router.get("/roles")
def list_roles_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
):
    stmt = select(Role).where(Role.tenant_id == tenant_id).options(
        selectinload(Role.users)
    )
    roles = list(db.scalars(stmt).all())
    return [
        {
            "id": r.id,
            "name": r.name,
            "description": r.description or "",
            "permissions": r.permissions or [],
            "user_count": len(r.users) if r.users else 0,
        }
        for r in roles
    ]


@router.post("/access-logs", response_model=AccessLogRead)
def create_access_log_endpoint(
    payload: AccessLogCreate, db: Session = Depends(get_db)
) -> AccessLogRead:
    return create_access_log(db, payload)


@router.get("/access-logs", response_model=list[AccessLogRead])
def list_access_logs_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[AccessLogRead]:
    return list_access_logs(db, tenant_id)
