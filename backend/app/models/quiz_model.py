from app.db.models import Quiz, QuizAttempt, Action, Article
from sqlalchemy import func
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
    
    

    def get_user_quizzes(self, user_id):
        return (
            self.db.query(
                Quiz.id.label("id"),
                Quiz.submitted_at.label("submitted_at"),
                Article.title.label("title"),
                Action.option.label("questions_count"),
                func.max(QuizAttempt.score).label("best_score"),
                func.max(QuizAttempt.submitted_at).label("last_attempt")
            )
            .outerjoin(Action, Quiz.action_id == Action.id)
            .outerjoin(Article, Article.id == Action.article_id)
            .outerjoin(QuizAttempt, QuizAttempt.quiz_id == Quiz.id)
            .filter(Action.user_id == user_id)
            .group_by(
                Quiz.id,
                Quiz.submitted_at,
                Article.title,
                Action.option
            )
            .all()
        )

