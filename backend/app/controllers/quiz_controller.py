from fastapi import HTTPException
from app.models.quiz_model import QuizModel




class QuizController:
        
    def __init__(self, db):
        self.model = QuizModel(db)
            


    def get_user_quiz_list(self, user_id):
        rows = self.model.get_user_quizzes(user_id)

        return [dict(r._mapping) for r in rows]
    


    def get_quiz_attempts(self, user_id, quiz_id):
        quiz = self.model.get_quiz_by_id(user_id, quiz_id)

        if not quiz:
            raise HTTPException(status_code=404, detail="Article Not Found")
        
        attempts = self.model.get_quiz_attempts(quiz_id)

        return {
            "attempts": attempts 
        }
    



    def get_quiz_details(self, user_id, quiz_id):
        quiz = self.model.get_quiz_by_id(user_id, quiz_id)

        if not quiz:
            raise HTTPException(status_code=404, detail="Quix Not Found")
        
        return dict(quiz._mapping)



    def get_attempt_by_id(self, attempt_id):
        attempt = self.model.get_attempt_by_id(attempt_id)

        if not attempt:
            raise HTTPException(status_code=404, detail="Attempt Not Found")

        return dict(attempt._mapping)