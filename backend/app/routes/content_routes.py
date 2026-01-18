from fastapi import APIRouter, Form, UploadFile, File
from app.controllers.content_controller import ContentController

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

# Instantiate the controller
controller = ContentController()

# Endpoint Wikipedia
@router.post("/wikipedia")
def ingest_wikipedia(url: str = Form(...), sentences: int = 0):
    title = controller.extract_wikipedia_title(url)
    return {"text": title}



# Endpoint PDF
@router.post("/pdf")
def ingest_pdf(file: UploadFile = File(...)):
    """
    Ingest content from uploaded PDF file.
    """
    text = controller.get_pdf_content(file)
    return {"text": text}