import wikipedia
import requests
from pypdf import PdfReader
from fastapi import UploadFile, HTTPException
from wikipedia.exceptions import DisambiguationError, PageError
from urllib.parse import urlparse, unquote
import re


class IngestionController:
    def __init__(
        self,
        user_agent: str = "WikiSmart/1.0 (contact: email@example.com)",
    ):
        """
        Initialise la session Wikipedia avec un User-Agent et la langue.
        """
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent})
        wikipedia.requests = self.session



    def get_wikipedia_article(self, ressource, method, lang):
        
        if method == 'url':
            try:
                topic = self.extract_wikipedia_title(ressource)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
        else:
            topic = ressource

        wikipedia.set_lang(lang)

        try:
            content = self.get_wikipedia_content(topic)
        except DisambiguationError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except PageError as e:
            raise HTTPException(status_code=404, detail=str(e))
        
        content = self.clean_wikipedia_content(content)

        return content




    def extract_wikipedia_title(self, url: str) -> str:
        parsed_url = urlparse(url)
        path = parsed_url.path  # ex: "/wiki/Python"

        if not parsed_url.netloc.endswith("wikipedia.org"):
            raise ValueError("Ce n'est pas une URL Wikipedia")

        if not path.startswith("/wiki/"):
            raise ValueError("Chemin Wikipedia invalide")

        title = path.replace("/wiki/", "", 1)

        title = title.replace('_', ' ')

        return unquote(title)
    


    def get_wikipedia_content(self, title: str) -> str:
        try:
            page = wikipedia.page(title)
            return page.content
        except DisambiguationError as e:
            return f"Plusieurs pages possibles: {e.options}"
        except PageError:
            return "Page introuvable"



    def clean_wikipedia_content(self, texte: str) -> str:

        # Supprimer les mentions entre crochets [...]
        texte = re.sub(r'\[.*?\]', '', texte, flags=re.DOTALL)

        # Supprimer les sections Wikipédia indésirables
        sections_a_supprimer = [
            r'==\s*Notes.*',
            r'==\s*Références.*',
            r'==\s*Voir aussi.*',
            r'==\s*Bibliographie.*',
            r'==\s*Liens externes.*'
        ]

        for section in sections_a_supprimer:
            texte = re.sub(section, '', texte, flags=re.DOTALL | re.IGNORECASE)

        # Espaces multiples
        texte = re.sub(r'\n{3,}', '\n\n', texte)
        texte = texte.strip()

        return texte



    def get_pdf_content(self, file: UploadFile) -> str:

        # Validate file type
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés.")

        # Save file temporarily
        file_path = f"/tmp/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # Extract PDF content using pypdf
        reader = PdfReader(file_path)
        text = "\n".join([page.extract_text() for page in reader.pages])
        
        return text