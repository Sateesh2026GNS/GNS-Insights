from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.schemas.alert import AlertCreate
from app.services.inventory_service import get_inventory_dashboard


def create_alert(db: Session, payload: AlertCreate) -> Alert:
    data = payload.model_dump()
    if not data.get("triggered_at"):
        data["triggered_at"] = datetime.now(timezone.utc)
    if not data.get("tenant_id"):
        data["tenant_id"] = 1
    a = Alert(**data)
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


def get_alert(db: Session, alert_id: int, tenant_id: int) -> Alert | None:
    alert = db.get(Alert, alert_id)
    if not alert or alert.tenant_id != tenant_id:
        return None
    return alert


def acknowledge_alert(db: Session, alert_id: int, tenant_id: int | None = None, acknowledged_by: str | None = None) -> Alert | None:
    alert = db.get(Alert, alert_id)
    if not alert:
        return None
    alert.acknowledged_at = datetime.now(timezone.utc)
    alert.status = "acknowledged"
    if acknowledged_by:
        alert.acknowledged_by = acknowledged_by
    elif not alert.acknowledged_by:
        alert.acknowledged_by = "HR Manager"
    db.commit()
    db.refresh(alert)
    return alert


def resolve_alert(db: Session, alert_id: int, tenant_id: int | None = None, resolved_by: str | None = None) -> Alert | None:
    alert = db.get(Alert, alert_id)
    if not alert:
        return None
    alert.status = "resolved"
    if not alert.acknowledged_at:
        alert.acknowledged_at = datetime.now(timezone.utc)
    if resolved_by:
        alert.acknowledged_by = resolved_by
    elif not alert.acknowledged_by:
        alert.acknowledged_by = "HR Manager"
    db.commit()
    db.refresh(alert)
    return alert


def delete_alert(db: Session, alert_id: int, tenant_id: int) -> bool:
    alert = get_alert(db, alert_id, tenant_id)
    if not alert:
        return False
    db.delete(alert)
    db.commit()
    return True


def sync_low_stock_alerts(db: Session, tenant_id: int) -> list[Alert]:
    """Create, update, or resolve low-stock alerts from current inventory levels."""
    dashboard = get_inventory_dashboard(db, tenant_id)
    low_items = [i for i in dashboard if i.get("needs_reorder")]

    existing = list(
        db.scalars(
            select(Alert).where(
                Alert.tenant_id == tenant_id,
                Alert.alert_type == "low_stock",
                Alert.reference_type == "inventory_item",
            )
        ).all()
    )
    existing_by_ref = {a.reference_id: a for a in existing if a.reference_id is not None}

    current_ids: set[int] = set()
    for item in low_items:
        item_id = item["id"]
        current_ids.add(item_id)
        title = f"Low stock: {item['name']}"
        message = (
            f"{item['name']} ({item['sku']}) has {item['total_quantity']} in stock; "
            f"reorder level is {item['reorder_level']}."
        )
        severity = "critical" if (item["total_quantity"] or 0) == 0 else "high"
        if item_id in existing_by_ref:
            alert = existing_by_ref[item_id]
            if alert.status == "active":
                alert.title = title
                alert.message = message
                alert.severity = severity
        else:
            db.add(
                Alert(
                    tenant_id=tenant_id,
                    alert_type="low_stock",
                    title=title,
                    message=message,
                    severity=severity,
                    status="active",
                    triggered_at=datetime.utcnow(),
                    reference_type="inventory_item",
                    reference_id=item_id,
                )
            )

    db.commit()
    return list_alerts(db, tenant_id, alert_type="low_stock")
