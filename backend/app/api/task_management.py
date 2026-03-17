from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter(prefix="/tasks", tags=["Task Management"])

@router.get("/assign-tasks")
def get_assigned_tasks(db: Session = Depends(get_db)):
    """Fetch assigned tasks."""
    return {"message": "Assigned tasks data."}

@router.get("/task-tracking")
def get_task_tracking(db: Session = Depends(get_db)):
    """Fetch task tracking data."""
    return {"message": "Task tracking data."}

@router.get("/task-reports")
def get_task_reports(db: Session = Depends(get_db)):
    """Fetch task reports."""
    return {"message": "Task reports data."}