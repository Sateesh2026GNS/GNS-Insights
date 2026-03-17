from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate


def create_alert(db: Session, payload: AlertCreate) -> Alert:
    a = Alert(**payload.model_dump())
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


def list_alerts(
    db: Session,
    tenant_id: int,
    alert_type: str | None = None,
    status: str | None = None,
) -> list[Alert]:
    stmt = select(Alert).where(Alert.tenant_id == tenant_id)
    if alert_type:
        stmt = stmt.where(Alert.alert_type == alert_type)
    if status:
        stmt = stmt.where(Alert.status == status)
    stmt = stmt.order_by(Alert.triggered_at.desc())
    return list(db.scalars(stmt).all())


def acknowledge_alert(db: Session, alert_id: int) -> Alert | None:
    alert = db.get(Alert, alert_id)
    if not alert:
        return None
    alert.acknowledged_at = datetime.utcnow()
    alert.status = "acknowledged"
    db.commit()
    db.refresh(alert)
    return alert
