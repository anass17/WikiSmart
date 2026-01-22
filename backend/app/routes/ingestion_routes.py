from fastapi import APIRouter, UploadFile, File, Depends
from app.controllers.ingestion_controller import IngestionController
from wikipedia.exceptions import DisambiguationError, PageError
from app.schemas.content_schema import IngestWikipediaRequest
from app.db.deps import get_db


router = APIRouter(prefix="/ingest", tags=["Ingestion"])



@router.post("/wikipedia")
def ingest_wikipedia(
    payload: IngestWikipediaRequest,
    db = Depends(get_db)
):

    controller = IngestionController(db)
    article = controller.get_wikipedia_article(payload.ressource, payload.method, payload.lang)

    return article



# Endpoint PDF
@router.post("/pdf")
def ingest_pdf(
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    
    controller = IngestionController(db)
    text = controller.get_pdf_content(file)
    
    return {"text": text}