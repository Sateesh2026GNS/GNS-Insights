from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.hr import (
    AttendanceRecordCreate,
    AttendanceRecordRead,
    EmployeeCreate,
    EmployeeRead,
    PayrollRecordCreate,
    PayrollRecordRead,
    PerformanceReviewCreate,
    PerformanceReviewRead,
    ShiftCreate,
    ShiftRead,
)
from app.services.hr_service import (
    create_attendance_record,
    create_employee,
    create_payroll_record,
    create_performance_review,
    create_shift,
    get_hr_dashboard,
    list_attendance,
    list_employees,
    list_payroll,
    list_performance_reviews,
    list_shifts,
    record_clock_in,
    record_clock_out,
)

router = APIRouter(prefix="/hr", tags=["hr"])


@router.get("/dashboard")
def hr_dashboard(tenant_id: int = Query(...), db: Session = Depends(get_db)):
    return get_hr_dashboard(db, tenant_id)


@router.post("/employees", response_model=EmployeeRead)
def create_employee_endpoint(payload: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, payload)


@router.get("/employees", response_model=list[EmployeeRead])
def list_employees_endpoint(tenant_id: int = Query(...), db: Session = Depends(get_db)):
    return list_employees(db, tenant_id)


@router.post("/shifts", response_model=ShiftRead)
def create_shift_endpoint(payload: ShiftCreate, db: Session = Depends(get_db)):
    return create_shift(db, payload)


@router.get("/shifts", response_model=list[ShiftRead])
def list_shifts_endpoint(tenant_id: int = Query(...), db: Session = Depends(get_db)):
    return list_shifts(db, tenant_id)


@router.post("/attendance", response_model=AttendanceRecordRead)
def create_attendance_endpoint(
    payload: AttendanceRecordCreate, db: Session = Depends(get_db)
):
    return create_attendance_record(db, payload)


@router.post("/attendance/clock-in", response_model=AttendanceRecordRead)
def clock_in_endpoint(
    tenant_id: int = Query(...),
    employee_id: int = Query(...),
    record_date: date = Query(...),
    db: Session = Depends(get_db),
):
    return record_clock_in(db, tenant_id, employee_id, record_date)


@router.post("/attendance/clock-out")
def clock_out_endpoint(
    tenant_id: int = Query(...),
    employee_id: int = Query(...),
    record_date: date = Query(...),
    db: Session = Depends(get_db),
):
    rec = record_clock_out(db, tenant_id, employee_id, record_date)
    if not rec:
        return {"success": False}
    return {"success": True, "record": AttendanceRecordRead.model_validate(rec)}


@router.get("/attendance", response_model=list[AttendanceRecordRead])
def list_attendance_endpoint(
    tenant_id: int = Query(...),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    employee_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    return list_attendance(db, tenant_id, date_from, date_to, employee_id)


@router.post("/payroll", response_model=PayrollRecordRead)
def create_payroll_endpoint(payload: PayrollRecordCreate, db: Session = Depends(get_db)):
    return create_payroll_record(db, payload)


@router.get("/payroll", response_model=list[PayrollRecordRead])
def list_payroll_endpoint(
    tenant_id: int = Query(...),
    employee_id: int | None = Query(None),
    period_start: date | None = Query(None),
    period_end: date | None = Query(None),
    db: Session = Depends(get_db),
):
    return list_payroll(db, tenant_id, employee_id, period_start, period_end)


@router.post("/performance", response_model=PerformanceReviewRead)
def create_performance_endpoint(
    payload: PerformanceReviewCreate, db: Session = Depends(get_db)
):
    return create_performance_review(db, payload)


@router.get("/performance", response_model=list[PerformanceReviewRead])
def list_performance_endpoint(
    tenant_id: int = Query(...),
    employee_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    return list_performance_reviews(db, tenant_id, employee_id)
