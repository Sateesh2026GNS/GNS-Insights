from datetime import date

from pydantic import BaseModel, ConfigDict


class CustomerBase(BaseModel):
    tenant_id: int
    name: str
    contact_name: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    state: str | None = None
    state_code: str | None = None
    gstin: str | None = None
    email: str | None = None
    phone: str | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class InvoiceItemBase(BaseModel):
    item_description: str
    qty: float
    unit: str = "pcs"
    rate: float
    amount: float


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItemRead(InvoiceItemBase):
    id: int
    invoice_id: int
    model_config = ConfigDict(from_attributes=True)


class SalesOrderBase(BaseModel):
    tenant_id: int
    customer_id: int
    order_number: str
    reference_number: str | None = None
    order_date: date
    status: str = "draft"
    total_amount: float = 0
    invoiced: bool = False
    packed: bool = False
    shipped: bool = False


class SalesOrderCreate(SalesOrderBase):
    pass


class SalesOrderRead(SalesOrderBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class SalesOrderListRead(SalesOrderRead):
    customer_name: str | None = None


class InvoiceBase(BaseModel):
    tenant_id: int
    customer_id: int
    sales_order_id: int | None = None
    invoice_number: str
    issue_date: date
    due_date: date | None = None
    subtotal: float = 0
    discount: float = 0
    sgst_pct: float = 0
    cgst_pct: float = 0
    igst_pct: float = 0
    sgst_amount: float = 0
    cgst_amount: float = 0
    igst_amount: float = 0
    round_off: float = 0
    grand_total: float = 0
    amount_paid: float = 0
    status: str = "draft"


class InvoiceCreate(InvoiceBase):
    items: list[InvoiceItemCreate] = []


class InvoiceRead(InvoiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class InvoiceListRead(InvoiceRead):
    customer_name: str | None = None


class PaymentBase(BaseModel):
    tenant_id: int
    invoice_id: int
    amount: float
    payment_date: date
    method: str = "cash"
    notes: str | None = None


class PaymentCreate(PaymentBase):
    pass


class PaymentRead(PaymentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
