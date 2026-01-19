from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from app.controllers.content_controller import ContentController
from wikipedia.exceptions import DisambiguationError, PageError

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

# Instantiate the controller
controller = ContentController()

# Endpoint Wikipedia
@router.post("/wikipedia")
def ingest_wikipedia(url: str = Form(...), sentences: int = 0):

    # Get Article Title 
    try:
        title = controller.extract_wikipedia_title(url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


    # Get Article Content
    try:
        content = controller.get_wikipedia_content(title)
    except DisambiguationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PageError as e:
        raise HTTPException(status_code=404, detail=str(e))
    

    # Get Sections
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