from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.admin import AccessLog
from app.schemas.admin import AccessLogCreate


def create_access_log(db: Session, payload: AccessLogCreate) -> AccessLog:
    al = AccessLog(**payload.model_dump())
    db.add(al)
    db.commit()
    db.refresh(al)
    return al


def list_access_logs(db: Session, tenant_id: int) -> list[AccessLog]:
    stmt = select(AccessLog).where(AccessLog.tenant_id == tenant_id)
    stmt = stmt.order_by(AccessLog.logged_at.desc())
    return list(db.scalars(stmt).all())
