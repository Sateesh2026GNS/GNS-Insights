from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/integrations", tags=["Integration Module"])

@router.get("/barcode-scanners")
def get_barcode_scanners(db: Session = Depends(get_db)):
    """Fetch barcode scanner integrations."""
    return {"message": "Barcode scanner integrations data."}

@router.get("/accounting-software")
def get_accounting_software_integrations(db: Session = Depends(get_db)):
    """Fetch accounting software integrations."""
    return {"message": "Accounting software integrations data."}

@router.get("/iot-machines")
def get_iot_machine_integrations(db: Session = Depends(get_db)):
    """Fetch IoT machine integrations."""
    return {"message": "IoT machine integrations data."}

@router.get("/api-integrations")
def get_api_integrations(db: Session = Depends(get_db)):
    """Fetch API integrations."""
    return {"message": "API integrations data."}