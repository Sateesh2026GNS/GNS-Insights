from pydantic import BaseModel


class ScheduleDashboardRead(BaseModel):
    today: str
    production_target: int = 0
    completed: int = 0
    pending: int = 0
    overall_progress_pct: float = 0
    machine_utilization_pct: float = 0
    operators_present: int = 0
    delayed_orders: int = 0
    material_shortage: int = 0


class ScheduleTimelineRowRead(BaseModel):
    machine_id: int
    machine_name: str
    machine_code: str
    status: str
    job_label: str
    work_order_id: int | None = None
    work_order_number: str | None = None
    start_slot: int = 0
    span_slots: int = 1
