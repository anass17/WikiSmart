from fastapi import HTTPException
from app.models.statistics_model import StatisticsModel
from app.models.user_model import UserModel




class StatisticsController:
        
    def __init__(self, db):
        self.model = StatisticsModel(db)
        self.user_model = UserModel(db)
            


    def get_statistics(self, user_id):
        user = self.user_model.get_user_by_id(user_id)


        if (not user):
            HTTPException(403, detail="Statistics Not Found")
        

        if (user.role == "USER"):
            counts = self.model.get_counts(user_id)
            top_articles = self.model.get_top_articles(user_id)

            return {
                "counts": counts._mapping,
                "top_articles": [article._mapping for article in top_articles],
            }
        

        counts = self.model.get_counts()
        top_articles = self.model.get_top_articles()
        top_users = self.model.get_top_users()


        return {
            "counts": counts._mapping,
            "top_articles": [article._mapping for article in top_articles],
            "top_users": [user._mapping for user in top_users]
        }



    