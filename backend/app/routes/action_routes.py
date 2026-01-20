from fastapi import APIRouter, Form
from app.controllers.action_controller import ActionController
from app.schemas.content_schema import SummerizeRequest, QCMRequest


router = APIRouter(prefix="/action", tags=["Action"])


action_controller = ActionController()


@router.post("/summarize")
def get_summarized_text(payload: SummerizeRequest):
    summary = action_controller.summarize_sections(payload.subject, payload.format, payload.sections)
    return {"summary": summary}



@router.post("/qcm")
def generate_qcm_endpoint(
    payload: QCMRequest
):
    qcm_list = action_controller.generate_qcm_from_sections(payload.sections, payload.n_questions)
    return {"qcms": qcm_list}