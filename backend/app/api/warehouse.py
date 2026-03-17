from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/warehouse", tags=["Warehouse Management"])

@router.get("/locations")
def get_warehouse_locations(db: Session = Depends(get_db)):
    """Fetch warehouse locations."""
    return {"message": "Warehouse locations data."}

@router.get("/bin-management")
def get_bin_management(db: Session = Depends(get_db)):
    """Fetch bin management data."""
    return {"message": "Bin management data."}

@router.get("/stock-transfers")
def get_stock_transfers(db: Session = Depends(get_db)):
    """Fetch stock transfer data."""
    return {"message": "Stock transfer data."}

@router.get("/warehouse-reports")
def get_warehouse_reports(db: Session = Depends(get_db)):
    """Fetch warehouse reports."""
    return {"message": "Warehouse reports data."}