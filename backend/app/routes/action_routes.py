from fastapi import APIRouter, Form
from app.controllers.action_controller import ActionController
from app.schemas.content_schema import SummerizeRequest


router = APIRouter(prefix="/action", tags=["Action"])


action_controller = ActionController()


@router.post("/summarize")
def get_summarized_text(data: SummerizeRequest):
    summary = action_controller.summarize_sections(data.subject, data.format, data.sections)
    return {"summary": summary}