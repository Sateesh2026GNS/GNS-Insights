from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.sales import Customer, Invoice, InvoiceItem, Payment, SalesOrder
from app.schemas.sales import (
    CustomerCreate,
    InvoiceCreate,
    InvoiceItemCreate,
    PaymentCreate,
    SalesOrderCreate,
)


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    c = Customer(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def list_customers(db: Session, tenant_id: int) -> list[Customer]:
    stmt = select(Customer).where(Customer.tenant_id == tenant_id)
    return list(db.scalars(stmt).all())


def create_sales_order(db: Session, payload: SalesOrderCreate) -> SalesOrder:
    so = SalesOrder(**payload.model_dump())
    db.add(so)
    db.commit()
    db.refresh(so)
    return so


def list_sales_orders(db: Session, tenant_id: int, status: str | None = None) -> list[SalesOrder]:
    stmt = (
        select(SalesOrder)
        .options(joinedload(SalesOrder.customer))
        .where(SalesOrder.tenant_id == tenant_id)
    )
    if status:
        stmt = stmt.where(SalesOrder.status == status)
    stmt = stmt.order_by(SalesOrder.order_date.desc())
    return list(db.scalars(stmt).all())


def _calc_gst(subtotal: float, sgst_pct: float, cgst_pct: float, igst_pct: float) -> tuple[float, float, float]:
    sgst = round(subtotal * (sgst_pct / 100), 2)
    cgst = round(subtotal * (cgst_pct / 100), 2)
    igst = round(subtotal * (igst_pct / 100), 2)
    return sgst, cgst, igst


def create_invoice(db: Session, payload: InvoiceCreate) -> Invoice:
    data = payload.model_dump(exclude={"items"})
    inv = Invoice(**data)
    db.add(inv)
    db.flush()
    subtotal = 0.0
    for item_data in payload.items:
        item = InvoiceItem(invoice_id=inv.id, **item_data)
        db.add(item)
        subtotal += item.amount
    inv.subtotal = subtotal
    sgst, cgst, igst = _calc_gst(
        subtotal, inv.sgst_pct, inv.cgst_pct, inv.igst_pct
    )
    inv.sgst_amount = sgst
    inv.cgst_amount = cgst
    inv.igst_amount = igst
    inv.grand_total = round(
        subtotal - inv.discount + sgst + cgst + igst + inv.round_off, 2
    )
    db.commit()
    db.refresh(inv)
    return inv


def get_invoice_with_items(db: Session, invoice_id: int) -> Invoice | None:
    stmt = (
        select(Invoice)
        .options(
            joinedload(Invoice.customer),
            selectinload(Invoice.items),
        )
        .where(Invoice.id == invoice_id)
    )
    return db.scalars(stmt).first()


def list_invoices(
    db: Session, tenant_id: int, status: str | None = None
) -> list[Invoice]:
    stmt = (
        select(Invoice)
        .options(joinedload(Invoice.customer))
        .where(Invoice.tenant_id == tenant_id)
    )
    if status:
        stmt = stmt.where(Invoice.status == status)
    stmt = stmt.order_by(Invoice.issue_date.desc())
    return list(db.scalars(stmt).all())


def create_payment(db: Session, payload: PaymentCreate) -> Payment:
    p = Payment(**payload.model_dump())
    db.add(p)
    inv = db.get(Invoice, payload.invoice_id)
    if inv:
        inv.amount_paid = (inv.amount_paid or 0) + payload.amount
        inv.status = "paid" if inv.amount_paid >= inv.grand_total else "partial"
    db.commit()
    db.refresh(p)
    return p


def list_payments(db: Session, tenant_id: int, invoice_id: int | None = None) -> list[Payment]:
    stmt = select(Payment).where(Payment.tenant_id == tenant_id)
    if invoice_id:
        stmt = stmt.where(Payment.invoice_id == invoice_id)
    stmt = stmt.order_by(Payment.payment_date.desc())
    return list(db.scalars(stmt).all())
