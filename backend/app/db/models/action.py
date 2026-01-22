from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, TIMESTAMP, func
from app.db.base import Base
from app.db.enums.action_enum import EnumAction

class Action(Base):
    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    type = Column(Enum(EnumAction, name="action_enum"), nullable=False)
    option = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())