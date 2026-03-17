from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.inventory import SupplierRead
from app.schemas.procurement import (
    GoodsReceiptCreate,
    GoodsReceiptRead,
    MaterialRequestCreate,
    MaterialRequestRead,
    PurchaseOrderCreate,
    PurchaseOrderRead,
    SupplierPaymentCreate,
    SupplierPaymentRead,
)
from app.services.inventory_service import list_suppliers
from app.services.procurement_service import (
    create_goods_receipt,
    create_material_request,
    create_purchase_order,
    create_supplier_payment,
    list_goods_receipts,
    list_material_requests,
    list_purchase_orders,
    list_supplier_payments,
)

router = APIRouter(prefix="/procurement", tags=["procurement"])


@router.post("/purchase-orders", response_model=PurchaseOrderRead)
def create_purchase_order_endpoint(
    payload: PurchaseOrderCreate, db: Session = Depends(get_db)
) -> PurchaseOrderRead:
    return create_purchase_order(db, payload)


@router.get("/purchase-orders", response_model=list[PurchaseOrderRead])
def list_purchase_orders_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[PurchaseOrderRead]:
    return list_purchase_orders(db, tenant_id)


@router.get("/vendors", response_model=list[SupplierRead])
def list_vendors_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[SupplierRead]:
    return list_suppliers(db, tenant_id)


@router.post("/material-requests", response_model=MaterialRequestRead)
def create_material_request_endpoint(
    payload: MaterialRequestCreate, db: Session = Depends(get_db)
) -> MaterialRequestRead:
    return create_material_request(db, payload)


@router.get("/material-requests", response_model=list[MaterialRequestRead])
def list_material_requests_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[MaterialRequestRead]:
    return list_material_requests(db, tenant_id)


@router.post("/goods-receipt", response_model=GoodsReceiptRead)
def create_goods_receipt_endpoint(
    payload: GoodsReceiptCreate, db: Session = Depends(get_db)
) -> GoodsReceiptRead:
    return create_goods_receipt(db, payload)


@router.get("/goods-receipt", response_model=list[GoodsReceiptRead])
def list_goods_receipts_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[GoodsReceiptRead]:
    return list_goods_receipts(db, tenant_id)


@router.post("/supplier-payments", response_model=SupplierPaymentRead)
def create_supplier_payment_endpoint(
    payload: SupplierPaymentCreate, db: Session = Depends(get_db)
) -> SupplierPaymentRead:
    return create_supplier_payment(db, payload)


@router.get("/supplier-payments", response_model=list[SupplierPaymentRead])
def list_supplier_payments_endpoint(
    tenant_id: int = Query(...), db: Session = Depends(get_db)
) -> list[SupplierPaymentRead]:
    return list_supplier_payments(db, tenant_id)
