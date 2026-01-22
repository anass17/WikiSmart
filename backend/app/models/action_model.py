from app.db.models import Action
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



    # def get_action(self, url, topic):
    #     return self.db.query(Action).where(
    #         (Article.url == url) & (Article.title == topic)
    #     ).first()