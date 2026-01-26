from fastapi import HTTPException
from app.core.config import settings
from groq import Groq
from google import genai
from app.schemas.summary_format import SummaryFormat
from app.models.action_model import ActionModel
from app.models.quiz_model import QuizModel
from app.models.article_model import ArticleModel
import json



GROG_API_KEY = settings.groq_api_key
GEMINI_API_KEY = settings.gemini_api_key


SUMMARY_CONFIG = {
    "court": {
        "max_tokens": 150,
        "sentences": "3 à 4 phrases",
    },
    "moyen": {
        "max_tokens": 250,
        "sentences": "5 à 6 phrases",
    },
}


class ActionController:
        
    def __init__(self, db, groq_client = None, gemini_client = None):
        self.client = groq_client if groq_client else Groq(api_key=GROG_API_KEY)
        self.gemini = gemini_client if gemini_client else genai.Client(api_key=GEMINI_API_KEY)
        self.model = ActionModel(db)
        self.article_model = ArticleModel(db)
        self.quiz_model = QuizModel(db)
            


    def summarize_section(self, article_id: int, format: SummaryFormat, user_id: int) -> str:

        article = self.article_model.get_article_by_id(article_id)
        if (not article):
            raise HTTPException(status_code=404, detail="Article Not Found")

        cfg = SUMMARY_CONFIG[format]

        text = article.content[:40000]

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=cfg['max_tokens'],
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Tu es un assistant qui résume des sections "
                        "d'articles Wikipédia de manière concise et factuelle."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Consignes :\n"
                        f"- Résumé {format.value}\n"
                        f"- {cfg['sentences']}\n"
                        "- Pas d'introduction\n"
                        "- Pas de répétition du titre\n"
                        "- Pas de phrases méta\n"
                        f"Texte :\n{text}"
                    )
                },
            ],
        )

        response = response.choices[0].message.content.strip()

        self.model.create_action(user_id, article.id, "SUMMERIZE", format.value)
        
        return response



    def generate_quiz(self, article_id: int, n_questions: int, user_id: int):

        article = self.article_model.get_article_by_id(article_id)
        if (not article):
            raise HTTPException(status_code=404, detail="Article Not Found")
        
        text = article.content

        prompt = (
            "Tu es un générateur de QCM.\n"
            "Génère UNIQUEMENT un JSON valide, sans texte, sans explication, sans markdown.\n\n"
            "Structure attendue :\n"
            "[\n"
            "  {\n"
            "    \"question\": \"\",\n"
            "    \"options\": [\"\", \"\", \"\", \"\"],\n"
            "    \"answer\": \"\"\n"
            "  }\n"
            "]\n\n"
            f"Texte source :\n{text}\n\n"
            f"Nombre de questions : {n_questions}\n"
            "Contraintes : 1 seule bonne réponse et 3 distracteurs par question."
        )

        response = self.gemini.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )


        action = self.model.create_action(user_id, article.id, "QCM", str(n_questions))
        
        try:
            qcms = json.loads(response.text)
        except Exception:
            # fallback : texte brut
            qcms = [{"question": response.text, "options": [], "answer": ""}]
    
        quiz = self.quiz_model.create_quiz(action.id, qcms)

        return {
            "quiz_id": quiz.id,
            "quiz": qcms
        }
    


    def translate_text(self, article_id: int, lang: str, user_id: int):

        article = self.article_model.get_article_by_id(article_id)
        if (not article):
            raise HTTPException(status_code=404, detail="Article Not Found")
        
        text = article.content

        prompt = (
            "Tu es un traducteur professionnel.\n\n"
            "Tâche :\n"
            f"Traduire le texte ci-dessous vers {lang}.\n\n"

            "Contraintes :\n"
            "- Respecter fidèlement le sens original.\n"
            "- Utiliser un langage clair, naturel et fluide.\n"
            "- Ne pas ajouter, supprimer ou interpréter des informations.\n"
            "- Conserver les termes techniques (ou les traduire correctement si un équivalent standard existe).\n"
            "- Ne produire que la traduction, sans commentaires.\n\n"

            "Texte à traduire :\n\n"
            f"{text}"
        )

        response = self.gemini.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )

        content = response.text

        self.model.create_action(user_id, article.id, "TRANSLATE", lang)

        return content
        


    def get_score(self, quiz_id: int, answers: list[str], user_id: int):

        quiz = self.quiz_model.get_quiz_by_id(user_id, quiz_id)
        if (not quiz):
            raise HTTPException(status_code=404, detail="Quiz Not Found")

        quiz_content = quiz.content

        score = 0

        for index, item in enumerate(quiz_content):
            if (item["answer"] == answers[index]):
                score += 1

        self.quiz_model.create_quiz_attempt(quiz_id, score, answers)

        return {
            "user_id": user_id,
            "answers": [item["answer"] for item in quiz_content],
            "score": score,
            "total": len(quiz_content)
        }
    


    def get_history(self, user_id):
        actions = self.model.get_all_actions(user_id)
        return [row._mapping for row in actions]