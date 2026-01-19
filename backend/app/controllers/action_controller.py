from app.core.config import settings
from groq import Groq
from app.schemas.summary_format import SummaryFormat

API_KEY = settings.api_key


SUMMARY_CONFIG = {
    "court": {
        "max_tokens": 80,
        "sentences": "1 à 2 phrases",
    },
    "moyen": {
        "max_tokens": 150,
        "sentences": "3 à 4 phrases",
    },
}


class ActionController:
        
    def __init__(self):
        self.client = Groq(api_key=API_KEY)
            


    def summarize_section(self, subject, title, text: str, format: SummaryFormat) -> str:

        cfg = SUMMARY_CONFIG[format]

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
                        f"Contexte global : article Wikipédia sur: {subject}.\n\n"
                        f"Section : {title}\n\n"
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
    


    def summarize_sections(self, subject, format, sections: dict):

        summaries = {}

        for title, text in sections.items():
            summary = self.summarize_section(subject, title, text, format)
            summaries[title] = summary

        return summaries