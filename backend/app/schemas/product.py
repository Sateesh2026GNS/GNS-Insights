from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    tenant_id: int
    sku: str = Field(..., min_length=1, max_length=64)
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    unit_cost: float | None = None
    unit_price: float | None = None
<<<<<<< HEAD
=======
    category: str | None = None
    product_type: str | None = None
    unit: str | None = None
    brand: str | None = None
    warehouse: str | None = None
    min_stock: int | None = None
    max_stock: int | None = None
    current_stock: int | None = None
    status: str | None = None
    barcode: str | None = None
    bom: str | None = None
    production_time: str | None = None
    machine_required: str | None = None
    quality_standard: str | None = None
    batch_tracking: bool | None = None
    serial_number: bool | None = None
    expiry_date: str | None = None
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: str | None = Field(None, min_length=1, max_length=64)
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    unit_cost: float | None = None
    unit_price: float | None = None
<<<<<<< HEAD
=======
    category: str | None = None
    product_type: str | None = None
    unit: str | None = None
    brand: str | None = None
    warehouse: str | None = None
    min_stock: int | None = None
    max_stock: int | None = None
    current_stock: int | None = None
    status: str | None = None
    barcode: str | None = None
    bom: str | None = None
    production_time: str | None = None
    machine_required: str | None = None
    quality_standard: str | None = None
    batch_tracking: bool | None = None
    serial_number: bool | None = None
    expiry_date: str | None = None
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8


class ProductDetailRead(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class BomItemBase(BaseModel):
    tenant_id: int
    product_id: int
    component_product_id: int
    quantity: float
    unit: str = Field(..., min_length=1, max_length=32)


class BomItemCreate(BomItemBase):
    pass


class BomItemRead(BomItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
