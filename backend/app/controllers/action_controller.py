from app.core.config import settings
from groq import Groq

API_KEY = settings.api_key



class ActionController:
        
    def __init__(self):
        self.client = Groq(api_key=API_KEY)
            


    def summarize_text(self, text: str) -> str:

        response = self.client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": "Tu es un assistant concis et précis."},
                {"role": "user", "content": f"Résume ce texte :\n\n{text}"}
            ],
            temperature=0.2,
            max_tokens=100,
        )
        
        # Retourne le texte du résumé
        return response.choices[0].message.content.strip()