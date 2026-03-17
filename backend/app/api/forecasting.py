from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/forecasting", tags=["Forecasting"])

@router.get("/production-forecast")
def get_production_forecast(db: Session = Depends(get_db)):
    """Fetch production forecast data."""
    return {"message": "Production forecast data."}

@router.get("/demand-forecast")
def get_demand_forecast(db: Session = Depends(get_db)):
    """Fetch demand forecast data."""
    return {"message": "Demand forecast data."}

@router.get("/inventory-forecast")
def get_inventory_forecast(db: Session = Depends(get_db)):
    """Fetch inventory forecast data."""
    return {"message": "Inventory forecast data."}