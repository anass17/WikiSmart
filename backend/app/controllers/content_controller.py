import wikipedia
import requests
from pypdf import PdfReader
from fastapi import UploadFile, HTTPException
from wikipedia.exceptions import DisambiguationError, PageError
from urllib.parse import urlparse, unquote


class ContentController:
    def __init__(
        self,
        user_agent: str = "MyWikiProject/1.0 (contact: email@example.com)",
        lang: str = "fr",
    ):
        """
        Initialise la session Wikipedia avec un User-Agent et la langue.
        """
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent})
        wikipedia.requests = self.session
        wikipedia.set_lang(lang)



    def extract_wikipedia_title(self, url: str) -> str:
        parsed_url = urlparse(url)
        path = parsed_url.path  # ex: "/wiki/Python"

        if not parsed_url.netloc.endswith("wikipedia.org"):
            raise ValueError("Ce n'est pas une URL Wikipedia")

        if not path.startswith("/wiki/"):
            raise ValueError("URL Wikipedia invalide")

        title = path.replace("/wiki/", "", 1)
        
        return unquote(title)


    def get_wikipedia_content(self, keyword: str, sentences: int = 0) -> str:
        """
        Récupère le contenu de Wikipedia pour un mot clé.
        Si sentences > 0, retourne un résumé.
        """
        try:
            if sentences > 0:
                return wikipedia.summary(keyword, sentences=sentences)
            page = wikipedia.page(keyword)
            return page.content
        except DisambiguationError as e:
            return f"Plusieurs pages possibles: {e.options}"
        except PageError:
            return "Page introuvable"



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