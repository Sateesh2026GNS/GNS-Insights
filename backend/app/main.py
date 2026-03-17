from sqlalchemy import text

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.accounts import router as accounts_router
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.analytics import router as analytics_router
from app.api.alerts import router as alerts_router
from app.api.documents import router as documents_router
from app.api.hr import router as hr_router
from app.api.inventory import router as inventory_router
from app.api.maintenance import router as maintenance_router
from app.api.procurement import router as procurement_router
from app.api.production import router as production_router
from app.api.quality import router as quality_router
from app.api.sales import router as sales_router
from app.api.factory_monitor import router as factory_monitor_router
from app.api.production_scheduling import router as production_scheduling_router
from app.api.supply_chain import router as supply_chain_router
from app.api.warehouse import router as warehouse_router
from app.api.dispatch import router as dispatch_router
from app.api.product_management import router as product_management_router
from app.api.forecasting import router as forecasting_router
from app.api.audit_logs import router as audit_logs_router
from app.api.task_management import router as task_management_router
from app.api.integration import router as integration_router
from app.api.iot import router as iot_router
from app.core.database import engine
from app.models.base import Base

# Import all models so they register with Base.metadata
from app.models import (  # noqa: F401
    accounts,
    admin,
    alert,
    bom,
    document,
    hr,
    inventory,
    machine,
    maintenance,
    procurement,
    production,
    product,
    quality,
    role,
    sales,
    tenant,
    user,
)

app = FastAPI(title="SMRT Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    # Add phone column if missing (for existing DBs)
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))
    except Exception:
        pass  # Column may already exist
    from app.core.database import SessionLocal
    from app.core.seed_products import seed_products
    from app.core.seed_roles import seed_roles
    from app.core.seed_tenant import seed_tenant
    from app.core.seed_users import seed_admin_user

    db = SessionLocal()
    try:
        seed_tenant(db)  # Ensure tenant 1 exists
        seed_roles(db)  # Seeds default roles for tenant 1
        seed_admin_user(db)  # admin@smrt.local / admin123 if no users
        seed_products(db)  # Seeds sample products for tenant 1
    except Exception as e:
        import traceback
        print(f"Seed warning: {e}")
        traceback.print_exc()
    finally:
        db.close()


app.include_router(auth_router)
app.include_router(production_router)
app.include_router(inventory_router)
app.include_router(procurement_router)
app.include_router(hr_router)
app.include_router(sales_router)
app.include_router(accounts_router)
app.include_router(analytics_router)
app.include_router(quality_router)
app.include_router(maintenance_router)
app.include_router(alerts_router)
app.include_router(admin_router)
app.include_router(documents_router)
app.include_router(factory_monitor_router)
app.include_router(production_scheduling_router)
app.include_router(supply_chain_router)
app.include_router(warehouse_router)
app.include_router(dispatch_router)
app.include_router(product_management_router)
app.include_router(forecasting_router)
app.include_router(audit_logs_router)
app.include_router(task_management_router)
app.include_router(integration_router)
app.include_router(iot_router)