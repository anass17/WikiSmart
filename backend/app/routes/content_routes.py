from fastapi import APIRouter, Form, UploadFile, File
from app.controllers.content_controller import ContentController

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

# Instantiate the controller
controller = ContentController()

# Endpoint Wikipedia
@router.post("/wikipedia")
def ingest_wikipedia(keyword: str = Form(...), sentences: int = 0):
    """
    Ingest content from Wikipedia.
    Optional: return a summary with 'sentences' param.
    """
    text = controller.get_wikipedia_content(keyword, sentences)
    return {"text": text}



# Endpoint PDF
@router.post("/pdf")
def ingest_pdf(file: UploadFile = File(...)):
    """
    Ingest content from uploaded PDF file.
    """
    text = controller.get_pdf_content(file)
    return {"text": text}