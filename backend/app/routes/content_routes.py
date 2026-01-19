from fastapi import APIRouter, Form, UploadFile, File
from app.controllers.content_controller import ContentController

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

# Instantiate the controller
controller = ContentController()

# Endpoint Wikipedia
@router.post("/wikipedia")
def ingest_wikipedia(url: str = Form(...), sentences: int = 0):
    title = controller.extract_wikipedia_title(url)

    content = controller.get_wikipedia_content(title, sentences)

    section = controller.split_wikipedia_sections(content)

    return {"sections": section}



# Endpoint PDF
@router.post("/pdf")
def ingest_pdf(file: UploadFile = File(...)):
    """
    Ingest content from uploaded PDF file.
    """
    text = controller.get_pdf_content(file)
    return {"text": text}