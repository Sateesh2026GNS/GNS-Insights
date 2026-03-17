from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.maintenance import (
    BreakdownReportCreate,
    BreakdownReportRead,
    MaintenanceRecordCreate,
    MaintenanceRecordRead,
    MaintenanceScheduleCreate,
    MaintenanceScheduleRead,
    PreventiveMaintenanceCreate,
    PreventiveMaintenanceRead,
)
from app.services.maintenance_service import (
    create_breakdown_report,
    create_maintenance_record,
    create_maintenance_schedule,
    create_preventive_maintenance,
    list_breakdown_reports,
    list_maintenance_records,
    list_maintenance_schedules,
    list_preventive_maintenance,
)

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.post("/records", response_model=MaintenanceRecordRead)
def create_maintenance_record_endpoint(
    payload: MaintenanceRecordCreate, db: Session = Depends(get_db)
) -> MaintenanceRecordRead:
    return create_maintenance_record(db, payload)


@router.get("/records", response_model=list[MaintenanceRecordRead])
def list_maintenance_records_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[MaintenanceRecordRead]:
    return list_maintenance_records(db, tenant_id)


@router.post("/preventive", response_model=PreventiveMaintenanceRead)
def create_preventive_endpoint(
    payload: PreventiveMaintenanceCreate, db: Session = Depends(get_db)
) -> PreventiveMaintenanceRead:
    return create_preventive_maintenance(db, payload)


@router.get("/preventive", response_model=list[PreventiveMaintenanceRead])
def list_preventive_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[PreventiveMaintenanceRead]:
    return list_preventive_maintenance(db, tenant_id)


@router.post("/breakdowns", response_model=BreakdownReportRead)
def create_breakdown_endpoint(
    payload: BreakdownReportCreate, db: Session = Depends(get_db)
) -> BreakdownReportRead:
    return create_breakdown_report(db, payload)


@router.get("/breakdowns", response_model=list[BreakdownReportRead])
def list_breakdowns_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[BreakdownReportRead]:
    return list_breakdown_reports(db, tenant_id)


@router.post("/schedule", response_model=MaintenanceScheduleRead)
def create_schedule_endpoint(
    payload: MaintenanceScheduleCreate, db: Session = Depends(get_db)
) -> MaintenanceScheduleRead:
    return create_maintenance_schedule(db, payload)


@router.get("/schedule", response_model=list[MaintenanceScheduleRead])
def list_schedule_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[MaintenanceScheduleRead]:
    return list_maintenance_schedules(db, tenant_id)
