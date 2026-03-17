from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.document import DocumentCreate, DocumentRead
from app.services.document_service import create_document, list_documents

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("", response_model=DocumentRead)
def create_document_endpoint(
    payload: DocumentCreate, db: Session = Depends(get_db)
) -> DocumentRead:
    return create_document(db, payload)


@router.get("", response_model=list[DocumentRead])
def list_documents_endpoint(
    tenant_id: int = Query(...),
    doc_type: str | None = Query(None),
    db: Session = Depends(get_db),
) -> list[DocumentRead]:
    return list_documents(db, tenant_id, doc_type)
