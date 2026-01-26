from fastapi import APIRouter, Depends
from app.controllers.quiz_controller import QuizController
from app.db.deps import get_db
from app.core.deps import get_current_user


router = APIRouter(prefix="/quiz", tags=["Quiz"])




@router.get("")
def get_quizzes_list(
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = QuizController(db)
    result = controller.get_user_quiz_list(user_id)

    return result


@router.get("/attempt/{id}")
def get_quiz_attempt(
    id: int,
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = QuizController(db)
    attempt = controller.get_attempt_by_id(id)

    return {
        "attempt": attempt
    }



@router.get("/{quiz_id}/attempts")
def get_quiz_by_id(
    quiz_id: int,
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = QuizController(db)
    result = controller.get_quiz_attempts(user_id, quiz_id)

    return result
        
        

@router.get("/{quiz_id}")
def get_quiz_details(
    quiz_id: int,
    db = Depends(get_db),
    user_id = Depends(get_current_user)
):
    controller = QuizController(db)
    quiz = controller.get_quiz_details(user_id, quiz_id)

    return {
        "quiz": quiz
    }
        