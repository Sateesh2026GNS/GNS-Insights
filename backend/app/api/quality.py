from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.quality import (
    BatchQualityReportCreate,
    BatchQualityReportRead,
    ComplianceLogCreate,
    ComplianceLogRead,
    DefectCreate,
    DefectRead,
    QualityInspectionCreate,
    QualityInspectionRead,
)
from app.services.quality_service import (
    create_batch_quality_report,
    create_compliance_log,
    create_defect,
    create_quality_inspection,
    list_batch_quality_reports,
    list_compliance_logs,
    list_defects,
    list_quality_inspections,
)

router = APIRouter(prefix="/quality", tags=["quality"])


@router.post("/inspection", response_model=QualityInspectionRead)
def create_inspection_endpoint(
    payload: QualityInspectionCreate, db: Session = Depends(get_db)
) -> QualityInspectionRead:
    return create_quality_inspection(db, payload)


@router.get("/inspection", response_model=list[QualityInspectionRead])
def list_inspections_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[QualityInspectionRead]:
    return list_quality_inspections(db, tenant_id)


@router.post("/defects", response_model=DefectRead)
def create_defect_endpoint(
    payload: DefectCreate, db: Session = Depends(get_db)
) -> DefectRead:
    return create_defect(db, payload)


@router.get("/defects", response_model=list[DefectRead])
def list_defects_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[DefectRead]:
    return list_defects(db, tenant_id)


@router.post("/batch-reports", response_model=BatchQualityReportRead)
def create_batch_report_endpoint(
    payload: BatchQualityReportCreate, db: Session = Depends(get_db)
) -> BatchQualityReportRead:
    return create_batch_quality_report(db, payload)


@router.get("/batch-reports", response_model=list[BatchQualityReportRead])
def list_batch_reports_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[BatchQualityReportRead]:
    return list_batch_quality_reports(db, tenant_id)


@router.post("/compliance", response_model=ComplianceLogRead)
def create_compliance_endpoint(
    payload: ComplianceLogCreate, db: Session = Depends(get_db)
) -> ComplianceLogRead:
    return create_compliance_log(db, payload)


@router.get("/compliance", response_model=list[ComplianceLogRead])
def list_compliance_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[ComplianceLogRead]:
    return list_compliance_logs(db, tenant_id)
