from fastapi import APIRouter, Form, UploadFile, File
from app.controllers import content_controller

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

# Endpoint Wikipedia
@router.post("/wikipedia")
def ingest_wikipedia(keyword: str = Form(...)):
    text = content_controller.get_wikipedia_content(keyword)
    return {"text": text}