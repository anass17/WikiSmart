from app.models.quiz_model import QuizModel




class QuizController:
        
    def __init__(self, db):
        self.model = QuizModel(db)
            


    def get_user_quiz_list(self, user_id):
        rows = self.model.get_user_quizzes(user_id)

        return [dict(r._mapping) for r in rows]