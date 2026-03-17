from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/production-scheduling", tags=["Production Scheduling"])

@router.get("/calendar")
def get_production_calendar(db: Session = Depends(get_db)):
    """Fetch production calendar."""
    return {"message": "Production calendar data."}

@router.get("/shift-scheduling")
def get_shift_scheduling(db: Session = Depends(get_db)):
    """Fetch shift scheduling data."""
    return {"message": "Shift scheduling data."}

@router.get("/machine-allocation")
def get_machine_allocation(db: Session = Depends(get_db)):
    """Fetch machine allocation data."""
    return {"message": "Machine allocation data."}

@router.get("/timeline")
def get_production_timeline(db: Session = Depends(get_db)):
    """Fetch production timeline."""
    return {"message": "Production timeline data."}