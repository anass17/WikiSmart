import wikipedia
import requests
from pypdf import PdfReader
from fastapi import UploadFile, HTTPException
from wikipedia.exceptions import DisambiguationError, PageError
from urllib.parse import urlparse, unquote
import re


class ContentController:
    def __init__(
        self,
        user_agent: str = "WikiSmart/1.0 (contact: email@example.com)",
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



    def split_wikipedia_sections(self, content: str) -> dict:
        sections = {}

        # Regex pour capturer les titres === Titre ===
        pattern = re.compile(r"===\s*(.*?)\s*===")

        matches = list(pattern.finditer(content))

        # Cas : pas de sections
        if not matches:
            return {"Introduction": content.strip()}
        
        intro_text = content[:matches[0].start()].strip()
        if intro_text:
            sections["Introduction"] = intro_text

        for i, match in enumerate(matches):
            section_title = match.group(1)

            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(content)

            section_text = content[start:end].strip()
            sections[section_title] = section_text


        # Supprimer les article non-pertinent

        sections.pop('Bibliographie', '')
        sections.pop('Articles connexes', '')
        sections.pop('Liens externes', '')

        return sections



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