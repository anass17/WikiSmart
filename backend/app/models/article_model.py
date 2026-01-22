from app.db.models import Article
from sqlalchemy.orm import Session

class ArticleModel:

    def __init__(self, db: Session):
        self.db = db



    def create_article(self, url, topic, content):
        article = Article(
            url=url,
            title=topic,
            content=content
        )

        self.db.add(article)
        self.db.commit()
        self.db.refresh(article)

        return article



    def get_article(self, url, topic):
        return self.db.query(Article).where(
            (Article.url == url) & (Article.title == topic)
        ).first()
    


    def get_article_by_id(self, id):
        return self.db.query(Article).where(Article.id == id).first()