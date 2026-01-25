from sqlalchemy import Column, Integer, ForeignKey, JSON, TIMESTAMP, func
from app.db.base import Base

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, nullable=False)
    user_answers = Column(JSON, nullable=False)
    submitted_at = Column(TIMESTAMP, server_default=func.now())