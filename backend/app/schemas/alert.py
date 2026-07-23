from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AlertBase(BaseModel):
    tenant_id: int | None = 1
    alert_type: str = "general"
    title: str
    message: str | None = None
    severity: str = "medium"
    status: str = "active"
    assigned_to: str | None = None
    created_by: str | None = None
    acknowledged_by: str | None = None
    triggered_at: datetime | None = None
    reference_type: str | None = None
    reference_id: int | None = None


class AlertCreate(AlertBase):
    pass


class AlertRead(AlertBase):
    id: int
    acknowledged_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)
