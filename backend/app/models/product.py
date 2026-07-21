<<<<<<< HEAD
from sqlalchemy import ForeignKey, Numeric, String, Text
=======
from sqlalchemy import ForeignKey, Numeric, String, Text, Integer, Boolean
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"), nullable=False, index=True
    )
    sku: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    unit_cost: Mapped[float | None] = mapped_column(Numeric(12, 2))
    unit_price: Mapped[float | None] = mapped_column(Numeric(12, 2))

<<<<<<< HEAD
=======
    # Extended attributes for complete storage
    category: Mapped[str | None] = mapped_column(String(128))
    product_type: Mapped[str | None] = mapped_column(String(64))
    unit: Mapped[str | None] = mapped_column(String(32))
    brand: Mapped[str | None] = mapped_column(String(128))
    warehouse: Mapped[str | None] = mapped_column(String(128))
    min_stock: Mapped[int | None] = mapped_column(Integer, default=10)
    max_stock: Mapped[int | None] = mapped_column(Integer, default=100)
    current_stock: Mapped[int | None] = mapped_column(Integer, default=0)
    status: Mapped[str | None] = mapped_column(String(32), default="active")
    barcode: Mapped[str | None] = mapped_column(String(128))
    bom: Mapped[str | None] = mapped_column(String(128))
    production_time: Mapped[str | None] = mapped_column(String(64))
    machine_required: Mapped[str | None] = mapped_column(String(64))
    quality_standard: Mapped[str | None] = mapped_column(String(128))
    batch_tracking: Mapped[bool | None] = mapped_column(Boolean, default=False)
    serial_number: Mapped[bool | None] = mapped_column(Boolean, default=False)
    expiry_date: Mapped[str | None] = mapped_column(String(64))

>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
    tenant = relationship("Tenant", back_populates="products")
    bom_items = relationship(
        "BillOfMaterial",
        foreign_keys="BillOfMaterial.product_id",
        back_populates="product",
        cascade="all, delete-orphan",
    )
    component_of = relationship(
        "BillOfMaterial",
        foreign_keys="BillOfMaterial.component_product_id",
        back_populates="component",
    )
    production_orders = relationship(
        "ProductionOrder", back_populates="product", cascade="all, delete-orphan"
    )
