from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/factory-monitor", tags=["Factory Monitor"])

@router.get("/live-production")
def get_live_production_status(db: Session = Depends(get_db)):
    """Fetch live production status."""
    return {"message": "Live production status data."}

@router.get("/machine-status")
def get_machine_status(db: Session = Depends(get_db)):
    """Fetch live machine status."""
    return {"message": "Machine status data."}

@router.get("/production-lines")
def get_production_lines_status(db: Session = Depends(get_db)):
    """Fetch production line status."""
    return {"message": "Production line status data."}