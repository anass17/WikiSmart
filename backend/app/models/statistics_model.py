from app.db.models import Quiz, Action, Article, User
from sqlalchemy.orm import Session
from sqlalchemy import func



class StatisticsModel:

    def __init__(self, db: Session):
        self.db = db
    


    def get_counts(self, user_id = None):

        condition = 1 == 1

        if (user_id):
            condition = Action.user_id == user_id


        result = self.db.query(
            # quizzes count
            self.db.query(func.count(Quiz.id))
            .join(Action, Quiz.action_id == Action.id)
            .filter(condition)
            .scalar_subquery()
            .label("quizzes"),

            # actions count
            self.db.query(func.count(Action.id))
            .filter(condition)
            .scalar_subquery()
            .label("actions"),

            # articles count
            self.db.query(func.count(Article.id))
            .join(Action, Article.id == Action.article_id)
            .filter(condition)
            .scalar_subquery()
            .label("articles"),

            # users count (usually global, not per user)
            self.db.query(func.count(User.id))
            .scalar_subquery()
            .label("users"),
        ).one()

        return result
    


    def get_top_articles(self, user_id = None):

        condition = 1 == 1

        if (user_id):
            condition = Action.user_id == user_id

        result = (
            self.db.query(
                Article.id,
                Article.title,
                Article.created_at.label("createdAt"),
                func.count(Action.id).label("actionsCount")
            )
            .outerjoin(Action, Action.article_id == Article.id)
            .where(condition)
            .group_by(
                Article.id,
                Article.title,
                Article.created_at
            )
            .order_by(func.count(Action.id).desc())
            .limit(3)
            .all()
        )

        return result
    


    def get_top_users(self):

        result = (
            self.db.query(
                User.id,
                User.first_name.label("firstName"),
                User.last_name.label("lastName"),
                User.email,
                User.created_at.label("regDate"),
                func.count(Action.id).label("actionsCount"),
                func.count(Quiz.id).label("quizzesCount")
            )
            .outerjoin(User, Action.user_id == User.id)
            .outerjoin(Article, Action.article_id == Article.id)
            .outerjoin(Quiz, Action.id == Quiz.action_id)
            .group_by(
                User.id,
                User.first_name,
                User.last_name,
                User.email,
            )
            .order_by(func.count(Action.id).desc())
            .limit(3)
            .all()
        )

        return result