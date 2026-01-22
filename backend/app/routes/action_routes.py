from fastapi import APIRouter, Depends
from app.controllers.action_controller import ActionController
from app.schemas.content_schema import SummerizeRequest, QCMRequest, TranslateRequest
from app.db.deps import get_db
from app.core.deps import get_current_user


router = APIRouter(prefix="/action", tags=["Action"])



@router.post("/summarize")
def get_summarized_text(
    payload: SummerizeRequest,
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = ActionController(db)
    summary = controller.summarize_section(payload.article_id, payload.format, user_id)
    return {"text": summary}



@router.post("/quiz")
def generate_quiz(
    payload: QCMRequest,
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    
    controller = ActionController(db)
    qcm_list = controller.generate_quiz(payload.article_id, payload.n_questions, user_id)
    return {"quiz": qcm_list}



@router.post("/translate")
def translate_text(
    payload: TranslateRequest,
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = ActionController(db)
    translated_text = controller.translate_text(payload.article_id, payload.lang, user_id)
    return {"text": translated_text}