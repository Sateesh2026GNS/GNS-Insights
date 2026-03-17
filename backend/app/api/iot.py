"""
IoT & Smart Factory API – wearables, machine analytics, sensors, cobots, AGVs, drones.
Based on IoT technology for smart manufacturing (automation, predictive maintenance, supply chain).
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.api.deps import get_db
from app.models.machine import Machine
from app.models.production import WorkOrder, DailyProductionReport
from app.models.maintenance import PreventiveMaintenance

router = APIRouter(prefix="/iot", tags=["IoT & Smart Factory"])


@router.get("/dashboard")
def iot_dashboard(tenant_id: int = Query(1), db: Session = Depends(get_db)):
    """Overview of all IoT systems: wearables, sensors, cobots, AGVs, drones, machine analytics."""
    machines = list(db.scalars(select(Machine).where(Machine.tenant_id == tenant_id)).all())
    running = sum(1 for m in machines if m.status == "running")
    # Sample IoT device counts (extend with real tables when needed)
    return {
        "wearables": {"count": 12, "active": 10, "function": "Collect data from multiple sources"},
        "sensors": {"count": 24, "active": 22, "function": "Supply chain & machine monitoring"},
        "cobots": {"count": 4, "active": 3, "function": "Collaborative material handling"},
        "agvs": {"count": 2, "active": 2, "function": "Easy navigation & transport"},
        "drones": {"count": 1, "active": 1, "function": "Monitor live operational working"},
        "machine_analytics": {
            "machines_total": len(machines),
            "machines_running": running,
            "predictive_maintenance": True,
            "inventory_streamlined": True,
        },
        "smart_packaging": {"enabled": True, "function": "Effective packaging solution"},
        "computer_vision": {"enabled": True, "function": "Quality & process monitoring"},
        "augmented_reality": {"enabled": False, "function": "Live operational overlay"},
    }


@router.get("/wearables")
def wearables_status(tenant_id: int = Query(1)):
    """Wearables – collect data from multiple sources."""
    return {
        "devices": [
            {"id": 1, "type": "smart_watch", "user": "Operator A", "status": "online", "last_sync": "2025-03-02T10:00:00Z"},
            {"id": 2, "type": "handheld_scanner", "user": "Stores", "status": "online", "last_sync": "2025-03-02T09:58:00Z"},
        ],
        "total": 12,
        "active": 10,
    }


@router.get("/machine-analytics")
def machine_analytics(tenant_id: int = Query(1), db: Session = Depends(get_db)):
    """Machine analytics – predictive maintenance, inventory streamlining."""
    machines = list(db.scalars(select(Machine).where(Machine.tenant_id == tenant_id)).all())
    maintenance_due = db.scalar(
        select(func.count(PreventiveMaintenance.id)).where(
            PreventiveMaintenance.tenant_id == tenant_id,
            PreventiveMaintenance.status == "scheduled",
        )
    ) or 0
    return {
        "machines": [{"id": m.id, "name": m.name, "status": m.status} for m in machines],
        "predictive_maintenance": {"scheduled": maintenance_due, "alerts": 0},
        "inventory_status": "streamlined",
    }


@router.get("/sensors")
def iot_sensors(tenant_id: int = Query(1)):
    """IoT sensors for supply chain & machine monitoring."""
    return {
        "sensors": [
            {"id": 1, "type": "temperature", "location": "Hall A", "value": 24.5, "unit": "°C"},
            {"id": 2, "type": "humidity", "location": "Hall A", "value": 55, "unit": "%"},
            {"id": 3, "type": "vibration", "location": "Machine M1", "value": 0.02, "unit": "g"},
        ],
        "total": 24,
        "healthy": 22,
    }


@router.get("/cobots")
def cobots_status(tenant_id: int = Query(1)):
    """Collaborative robots – material handling, assist workers."""
    return {
        "cobots": [
            {"id": 1, "name": "Cobot-01", "status": "working", "current_task": "Pallet transfer"},
            {"id": 2, "name": "Cobot-02", "status": "idle", "current_task": None},
        ],
        "total": 4,
        "active": 3,
    }


@router.get("/agvs")
def agvs_status(tenant_id: int = Query(1)):
    """AGVs / Unmanned trucks – easy navigation, internal logistics."""
    return {
        "agvs": [
            {"id": 1, "name": "AGV-01", "status": "moving", "destination": "Warehouse A"},
            {"id": 2, "name": "AGV-02", "status": "loading", "destination": "Production Line 2"},
        ],
        "total": 2,
        "active": 2,
    }


@router.get("/drones")
def drones_status(tenant_id: int = Query(1)):
    """UAV / Drones – monitor live operational working."""
    return {
        "drones": [{"id": 1, "name": "Drone-01", "status": "flying", "area": "Warehouse"}],
        "total": 1,
        "active": 1,
    }


@router.get("/smart-packaging")
def smart_packaging(tenant_id: int = Query(1)):
    """Smart packaging – effective packaging solutions."""
    return {
        "enabled": True,
        "stations": [
            {"id": 1, "location": "Pack Line 1", "status": "active"},
            {"id": 2, "location": "Pack Line 2", "status": "active"},
        ],
    }


@router.get("/live-operations")
def live_operations(tenant_id: int = Query(1), db: Session = Depends(get_db)):
    """Combined live view – machine status + work orders for AR/computer vision overlay."""
    machines = list(db.scalars(select(Machine).where(Machine.tenant_id == tenant_id)).all())
    wos = list(db.scalars(
        select(WorkOrder).where(WorkOrder.tenant_id == tenant_id).limit(10)
    ).all())
    return {
        "machines": [{"id": m.id, "name": m.name, "status": m.status, "location": m.location} for m in machines],
        "active_work_orders": [{"id": w.id, "number": w.work_order_number, "status": w.status} for w in wos],
    }
