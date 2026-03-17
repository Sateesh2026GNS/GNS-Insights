from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AccessLogBase(BaseModel):
    tenant_id: int
    user_id: int | None = None
    action: str
    resource: str | None = None
    resource_id: int | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    logged_at: datetime


class AccessLogCreate(AccessLogBase):
    pass


class AccessLogRead(AccessLogBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
