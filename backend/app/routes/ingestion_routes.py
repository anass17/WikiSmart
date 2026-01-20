from fastapi import APIRouter, UploadFile, File, HTTPException
from app.controllers.ingestion_controller import IngestionController
from wikipedia.exceptions import DisambiguationError, PageError
from app.schemas.content_schema import IngestWikipediaRequest

router = APIRouter(prefix="/ingest", tags=["Ingestion"])


controller = IngestionController()



@router.post("/wikipedia")
def ingest_wikipedia(payload: IngestWikipediaRequest):

    content = controller.get_wikipedia_article(payload.ressource, payload.method, payload.lang)

    return {"content": content}



# Endpoint PDF
@router.post("/pdf")
def ingest_pdf(file: UploadFile = File(...)):
    """
    Ingest content from uploaded PDF file.
    """
    text = controller.get_pdf_content(file)
    return {"text": text}