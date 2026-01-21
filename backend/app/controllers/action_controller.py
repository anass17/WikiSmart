from app.core.config import settings
from groq import Groq
from google import genai
from app.schemas.summary_format import SummaryFormat
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
        
    def __init__(self, groq_client = None, gemini_client = None):
        self.client = groq_client if groq_client else Groq(api_key=GROG_API_KEY)
        self.gemini = gemini_client if gemini_client else genai.Client(api_key=GEMINI_API_KEY)
            


    def summarize_section(self, text: str, format: SummaryFormat) -> str:

        cfg = SUMMARY_CONFIG[format]

        text = text[:40000]

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
        
        # Retourne le texte du résumé
        return response.choices[0].message.content.strip()



    def generate_qcm(self, text: str, n_questions: int):

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
        
        # On suppose que Gemini renvoie du JSON
        try:
            qcms = json.loads(response.text)
        except Exception:
            # fallback : texte brut
            qcms = [{"question": response.text, "options": [], "answer": ""}]
        return qcms
    


    def translate_text(self, text: str, lang: str):

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

        return response.text
    


    # def get_score(self, answers: dict[a], lang: str):

    #     prompt = (
    #         "Tu es un traducteur professionnel.\n\n"
    #         "Tâche :\n"
    #         f"Traduire le texte ci-dessous vers {lang}.\n\n"

    #         "Contraintes :\n"
    #         "- Respecter fidèlement le sens original.\n"
    #         "- Utiliser un langage clair, naturel et fluide.\n"
    #         "- Ne pas ajouter, supprimer ou interpréter des informations.\n"
    #         "- Conserver les termes techniques (ou les traduire correctement si un équivalent standard existe).\n"
    #         "- Ne produire que la traduction, sans commentaires.\n\n"

    #         "Texte à traduire :\n\n"
    #         f"{text}"
    #     )

    #     response = self.gemini.models.generate_content(
    #         model="gemini-flash-latest",
    #         contents=prompt
    #     )

    #     return response.text