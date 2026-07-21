"""Admin panel API: user & role management (RBAC), activity logs.

All endpoints require an authenticated administrator and are scoped to the
acting user's tenant. Other roles are rejected with 403.

Legacy flat JSON responses — see /api/settings/* for the standard envelope.
"""

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.permissions import require_admin
from app.models.user import User
from app.schemas.rbac import (
    RoleCreate,
    RolePermissionsUpdate,
    RoleUpdate,
    UserCreate,
    UserUpdate,
)
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/admin", tags=["admin"])


def _svc(db: Session, admin: User) -> SettingsService:
    return SettingsService(db, admin)


# ---------------------------------------------------------------------------
# Permission catalogue
# ---------------------------------------------------------------------------
@router.get("/permissions/modules")
def list_modules(_: User = Depends(require_admin)):
    return SettingsService.list_modules()


@router.get("/permissions/matrix")
def permission_matrix(_: User = Depends(require_admin)):
    return SettingsService.permission_matrix()


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------
@router.get("/users")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return _svc(db, admin).list_users()


@router.get("/users/stats")
def user_stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return _svc(db, admin).user_stats()


@router.get("/users/{user_id}")
def get_user(
    user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)
):
    return _svc(db, admin).get_user(user_id)


@router.post("/users", status_code=201)
def create_user(
    payload: UserCreate,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).create_user(payload, request)


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    payload: UserUpdate,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).update_user(user_id, payload, request)


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).delete_user(user_id, request)


# ---------------------------------------------------------------------------
# Roles
# ---------------------------------------------------------------------------
@router.get("/roles")
def list_roles(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return _svc(db, admin).list_roles()


@router.get("/roles/{role_id}")
def get_role(
    role_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)
):
    return _svc(db, admin).get_role(role_id)


@router.post("/roles", status_code=201)
def create_role(
    payload: RoleCreate,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).create_role(payload, request)


@router.put("/roles/{role_id}")
def update_role(
    role_id: int,
    payload: RoleUpdate,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).update_role(role_id, payload, request)


@router.put("/roles/{role_id}/permissions")
def update_role_permissions(
    role_id: int,
    payload: RolePermissionsUpdate,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).update_role_permissions(role_id, payload, request)


@router.delete("/roles/{role_id}")
def delete_role(
    role_id: int,
    request: Request,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return _svc(db, admin).delete_role(role_id, request)


# ---------------------------------------------------------------------------
# Activity / access logs
# ---------------------------------------------------------------------------
@router.get("/access-logs")
def list_access_logs(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(200, ge=1, le=500),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    data = _svc(db, admin).list_audit_logs(
        search=search, page=page, page_size=page_size
    )
    return data["items"]


# ---------------------------------------------------------------------------
# Pending approvals (admin dashboard)
# ---------------------------------------------------------------------------
@router.get("/approvals")
def pending_approvals(
    admin: User = Depends(require_admin), db: Session = Depends(get_db)
):
    from app.services.approval_service import get_pending_approvals

    return get_pending_approvals(db, admin.tenant_id)
