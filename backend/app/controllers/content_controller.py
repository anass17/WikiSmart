import wikipedia
import requests
# from langchain.document_loaders import PyPDFLoader
# from fastapi import UploadFile



# Configurer la session avec un User-Agent
session = requests.Session()
session.headers.update({
    "User-Agent": "MyWikiProject/1.0 (contact: email@example.com)"
})
wikipedia.requests = session
wikipedia.set_lang("fr")



def get_wikipedia_content(keyword: str, sentences: int = 0) -> str:
    """
    Récupère le contenu de Wikipedia pour un mot clé.
    Si sentences > 0, retourne un résumé.
    """
    try:
        if sentences > 0:
            return wikipedia.summary(keyword, sentences=sentences)
        page = wikipedia.page(keyword)
        return page.content
    except wikipedia.exceptions.DisambiguationError as e:
        return f"Plusieurs pages possibles: {e.options}"
    except wikipedia.exceptions.PageError:
        return "Page introuvable"
