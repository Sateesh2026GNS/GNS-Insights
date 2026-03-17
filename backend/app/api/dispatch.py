from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/dispatch", tags=["Dispatch & Logistics"])

@router.get("/dispatch-orders")
def get_dispatch_orders(db: Session = Depends(get_db)):
    """Fetch dispatch orders."""
    return {"message": "Dispatch orders data."}

@router.get("/shipment-tracking")
def get_shipment_tracking(db: Session = Depends(get_db)):
    """Fetch shipment tracking data."""
    return {"message": "Shipment tracking data."}

@router.get("/delivery-status")
def get_delivery_status(db: Session = Depends(get_db)):
    """Fetch delivery status data."""
    return {"message": "Delivery status data."}

@router.get("/transport-details")
def get_transport_details(db: Session = Depends(get_db)):
    """Fetch transport details."""
    return {"message": "Transport details data."}