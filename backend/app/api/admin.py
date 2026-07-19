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


# ----- Testing / Reset Data -----

def _resolve_db_paths():
    """Return (db_path, undo_path) as absolute Path objects.

    The paths are resolved relative to the *backend root* directory (the
    folder that contains ``smrt.db``) regardless of the working directory
    that uvicorn was launched from.
    """
    from pathlib import Path

    backend_root = Path(__file__).resolve().parent.parent.parent
    return backend_root / "smrt.db", backend_root / "smrt.db.undo"


@router.post("/clear-data")
def clear_data_endpoint(db: Session = Depends(get_db)):
    import shutil
    from fastapi import HTTPException
    from sqlalchemy import text
    from app.core.database import SessionLocal

    db_path, undo_path = _resolve_db_paths()

    try:
        db.commit()
    except Exception:
        pass
    db.close()

    try:
        if db_path.exists():
            shutil.copy2(str(db_path), str(undo_path))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to create undo backup: {str(exc)}") from exc

    fresh_db = SessionLocal()
    try:
        tables_to_clear = [
            "work_orders",
            "production_orders",
            "batches",
            "daily_production_reports",
            "dispatch_shipments",
            "invoice_items",
            "invoices",
            "payments",
            "sales_orders",
            "quotations",
            "leads",
            "customers",
            "stock_movements",
            "stock_levels",
            "stock_transfers",
            "stock_adjustments",
            "inventory_items",
            "warehouses",
            "goods_receipt_lines",
            "goods_receipts",
            "purchase_order_lines",
            "purchase_orders",
            "supplier_payments",
            "vendor_bills",
            "vendor_quotations",
            "material_request_lines",
            "material_requests",
            "rfqs",
            "suppliers",
            "defects",
            "quality_inspections",
            "batch_quality_reports",
            "compliance_logs",
            "breakdown_reports",
            "maintenance_records",
            "preventive_maintenance",
            "maintenance_schedules",
            "attendance_records",
            "leave_requests",
            "payroll_records",
            "performance_reviews",
            "shifts",
            "employees",
            "departments",
            "income",
            "expenses",
            "documents",
            "bill_of_materials",
            "machines",
            "machine_status_events",
            "alerts",
            "tasks",
            "ai_messages",
            "ai_conversations",
            "user_notification_states",
            "audit_logs",
            "access_logs",
        ]
        fresh_db.execute(text("PRAGMA foreign_keys = OFF;"))
        for table in tables_to_clear:
            fresh_db.execute(text(f"DELETE FROM {table};"))
        fresh_db.execute(text("PRAGMA foreign_keys = ON;"))
        fresh_db.commit()
    except Exception as exc:
        fresh_db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear database tables: {str(exc)}") from exc
    finally:
        fresh_db.close()

    return {"success": True, "message": "All data cleared successfully"}


@router.post("/undo-data")
def undo_data_endpoint(db: Session = Depends(get_db)):
    import shutil
    import time
    from app.core.database import engine
    from fastapi import HTTPException

    db_path, undo_path = _resolve_db_paths()

    if not undo_path.exists():
        raise HTTPException(status_code=400, detail="No clear-data backup found to undo.")

    try:
        db.close()
        engine.dispose()
        time.sleep(0.3)
        shutil.copy2(str(undo_path), str(db_path))
        engine.dispose()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to restore database from backup: {str(exc)}") from exc

    return {"success": True, "message": "Database restored from backup successfully"}
