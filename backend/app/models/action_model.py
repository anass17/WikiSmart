from app.db.models import Action, Article
from sqlalchemy.orm import Session
from app.db.enums.action_enum import EnumAction

class ActionModel:

    def __init__(self, db: Session):
        self.db = db



    def create_action(self, user_id: int, article_id: int, type: EnumAction, option: str):
        action = Action(
            user_id=user_id,
            article_id=article_id,
            type=type,
            option=option
        )

        self.db.add(action)
        self.db.commit()
        self.db.refresh(action)

        return action



    def get_all_actions(self, user_id):
        return (
            self.db.query(
                Action.id,
                Article.title,
                Action.type,
                Action.created_at,
                Action.option,
            )
            .join(Article, Article.id == Action.article_id)
            .where(Action.user_id == user_id)
            .order_by(Action.created_at.desc())
            .all()
        )