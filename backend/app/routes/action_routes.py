from fastapi import APIRouter, Form
from app.controllers.action_controller import ActionController


router = APIRouter(prefix="/action", tags=["Action"])


action_controller = ActionController()


@router.post("/summarize")
def get_summarized_text(text: str = Form(...)):
    summary = action_controller.summarize_text(text)
    return {"summary": summary}