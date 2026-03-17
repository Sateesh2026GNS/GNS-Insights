from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.sales import (
    CustomerCreate,
    CustomerRead,
    InvoiceCreate,
    InvoiceListRead,
    InvoiceRead,
    InvoiceItemRead,
    PaymentCreate,
    PaymentRead,
    SalesOrderCreate,
    SalesOrderListRead,
    SalesOrderRead,
)
from app.services.sales_service import (
    create_customer,
    create_invoice,
    create_payment,
    create_sales_order,
    get_invoice_with_items,
    list_customers,
    list_invoices,
    list_payments,
    list_sales_orders,
)

router = APIRouter(prefix="/sales", tags=["sales"])


@router.post("/customers", response_model=CustomerRead)
def create_customer_endpoint(payload: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db, payload)


@router.get("/customers", response_model=list[CustomerRead])
def list_customers_endpoint(tenant_id: int = Query(...), db: Session = Depends(get_db)):
    return list_customers(db, tenant_id)


@router.post("/sales-orders", response_model=SalesOrderRead)
def create_sales_order_endpoint(payload: SalesOrderCreate, db: Session = Depends(get_db)):
    return create_sales_order(db, payload)


@router.get("/sales-orders", response_model=list[SalesOrderListRead])
def list_sales_orders_endpoint(
    tenant_id: int = Query(...),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
):
    orders = list_sales_orders(db, tenant_id, status)
    return [
        SalesOrderListRead(
            **SalesOrderRead.model_validate(o).model_dump(),
            customer_name=o.customer.name if o.customer else None,
        )
        for o in orders
    ]


@router.post("/invoices", response_model=InvoiceRead)
def create_invoice_endpoint(payload: InvoiceCreate, db: Session = Depends(get_db)):
    return create_invoice(db, payload)


@router.get("/invoices", response_model=list[InvoiceListRead])
def list_invoices_endpoint(
    tenant_id: int = Query(...),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
):
    invs = list_invoices(db, tenant_id, status)
    return [
        InvoiceListRead(
            **InvoiceRead.model_validate(i).model_dump(),
            customer_name=i.customer.name if i.customer else None,
        )
        for i in invs
    ]


@router.get("/invoices/{invoice_id}")
def get_invoice_detail_endpoint(invoice_id: int, db: Session = Depends(get_db)):
    inv = get_invoice_with_items(db, invoice_id)
    if not inv:
        return {"found": False}
    data = InvoiceRead.model_validate(inv)
    items = [InvoiceItemRead.model_validate(i) for i in inv.items]
    cust = CustomerRead.model_validate(inv.customer) if inv.customer else None
    return {"found": True, "invoice": data, "items": items, "customer": cust}


@router.post("/payments", response_model=PaymentRead)
def create_payment_endpoint(payload: PaymentCreate, db: Session = Depends(get_db)):
    return create_payment(db, payload)


@router.get("/payments", response_model=list[PaymentRead])
def list_payments_endpoint(
    tenant_id: int = Query(...),
    invoice_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    return list_payments(db, tenant_id, invoice_id)
