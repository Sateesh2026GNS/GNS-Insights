from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.alert import AlertCreate, AlertRead
from app.services.alert_service import acknowledge_alert, create_alert, list_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("", response_model=AlertRead)
def create_alert_endpoint(
    payload: AlertCreate, db: Session = Depends(get_db)
) -> AlertRead:
    return create_alert(db, payload)


@router.get("", response_model=list[AlertRead])
def list_alerts_endpoint(
    tenant_id: int = Query(...),
    alert_type: str | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[AlertRead]:
    return list_alerts(db, tenant_id, alert_type, status)


@router.post("/{alert_id}/acknowledge")
def acknowledge_alert_endpoint(
    alert_id: int, db: Session = Depends(get_db)
):
    alert = acknowledge_alert(db, alert_id)
    if not alert:
        return {"acknowledged": False}
    return {"acknowledged": True}
