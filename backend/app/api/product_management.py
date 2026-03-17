from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/products", tags=["Product Management"])

@router.get("/catalog")
def get_product_catalog(db: Session = Depends(get_db)):
    """Fetch product catalog."""
    return {"message": "Product catalog data."}

@router.get("/categories")
def get_product_categories(db: Session = Depends(get_db)):
    """Fetch product categories."""
    return {"message": "Product categories data."}

@router.get("/bom")
def get_bill_of_materials(db: Session = Depends(get_db)):
    """Fetch bill of materials (BOM)."""
    return {"message": "Bill of materials data."}

@router.get("/costing")
def get_product_costing(db: Session = Depends(get_db)):
    """Fetch product costing data."""
    return {"message": "Product costing data."}