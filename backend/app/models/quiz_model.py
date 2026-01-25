from app.db.models import Quiz, QuizAttempt
from sqlalchemy.orm import Session



class QuizModel:

    def __init__(self, db: Session):
        self.db = db



    def create_quiz(self, action_id, content):
        quiz = Quiz(
            action_id = action_id,
            content = content
        )
        self.db.add(quiz)
        self.db.commit()
        self.db.refresh(quiz)

        return quiz
    


    def get_quiz_by_id(self, id):
        return self.db.query(Quiz).where(Quiz.id == id).first()
    


    def create_quiz_attempt(self, quiz_id, score, user_answers):
        quiz_attempt = QuizAttempt(
            quiz_id = quiz_id,
            score = score,
            user_answers = user_answers
        )
        self.db.add(quiz_attempt)
        self.db.commit()
        self.db.refresh(quiz_attempt)

        return quiz_attempt
