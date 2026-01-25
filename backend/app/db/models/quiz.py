from sqlalchemy import Column, Integer, ForeignKey, JSON, TIMESTAMP, func
from app.db.base import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, ForeignKey("actions.id"), nullable=False)
    content = Column(JSON, nullable=False)
    submitted_at = Column(TIMESTAMP, server_default=func.now())