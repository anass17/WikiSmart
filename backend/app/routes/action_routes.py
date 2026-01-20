from fastapi import APIRouter, Form
from app.controllers.action_controller import ActionController
from app.schemas.content_schema import SummerizeRequest, QCMRequest, TranslateRequest


router = APIRouter(prefix="/action", tags=["Action"])


action_controller = ActionController()


@router.post("/summarize")
def get_summarized_text(payload: SummerizeRequest):
    summary = action_controller.summarize_section(payload.text, payload.format)
    return {"summary": summary}



@router.post("/qcm")
def generate_qcm(
    payload: QCMRequest
):
    qcm_list = action_controller.generate_qcm(payload.text, payload.n_questions)
    return {"qcms": qcm_list}



@router.post("/translate")
def translate_text(
    payload: TranslateRequest
):
    translated_text = action_controller.translate_text(payload.text, payload.lang)
    return {"text": translated_text}