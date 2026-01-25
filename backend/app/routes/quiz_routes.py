from fastapi import APIRouter, Depends
from app.controllers.quiz_controller import QuizController
from app.db.deps import get_db
from app.core.deps import get_current_user


router = APIRouter(prefix="/quiz", tags=["Quiz"])




@router.get("")
def translate_text(
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = QuizController(db)
    result = controller.get_user_quiz_list(user_id)

    return result
        