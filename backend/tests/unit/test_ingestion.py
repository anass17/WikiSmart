import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from fastapi import UploadFile


# Crée le client FastAPI pour tester les endpoints
client = TestClient(app)

# -----------------------------
# Tests Wikipedia
# -----------------------------

@patch("wikipedia.page")
def test_wikipedia_endpoint_success(mock_page):
    # Simule un article Wikipedia
    mock_page.return_value.content = "Contenu simulé de Wikipedia"
    
    response = client.post("/ingest/wikipedia", data={"keyword": "Python"})
    assert response.status_code == 200
    assert response.json()["text"] == "Contenu simulé de Wikipedia"

@patch("wikipedia.page")
def test_wikipedia_endpoint_page_not_found(mock_page):
    from wikipedia.exceptions import PageError
    mock_page.side_effect = PageError("Not found")
    
    response = client.post("/ingest/wikipedia", data={"keyword": "Inexistant"})
    assert response.status_code == 200
    assert response.json()["text"] == "Page introuvable"

@patch("wikipedia.page")
def test_wikipedia_endpoint_disambiguation(mock_page):
    from wikipedia.exceptions import DisambiguationError
    mock_page.side_effect = DisambiguationError("Choix multiples", ["Page1", "Page2"])
    
    response = client.post("/ingest/wikipedia", data={"keyword": "Ambigu"})
    assert response.status_code == 200
    assert "Plusieurs pages possibles" in response.json()["text"]



# -----------------------------
# Tests PDF
# -----------------------------

@patch("app.controllers.content_controller.PdfReader")  # patch PdfReader in your controller
def test_pdf_endpoint_success(mock_pdf_reader):
    # Mock PDF pages
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Contenu simulé PDF"
    mock_pdf_reader.return_value.pages = [mock_page, mock_page]

    # Simulated file content
    file_content = b"Fake PDF content"
    response = client.post(
        "/ingest/pdf",
        files={"file": ("test.pdf", file_content, "application/pdf")}
    )

    assert response.status_code == 200
    # The text should concatenate all pages
    assert response.json()["text"] == "Contenu simulé PDF\nContenu simulé PDF"



# -----------------------------
# Tests combinés
# -----------------------------

@patch("wikipedia.page")
@patch("app.controllers.content_controller.PdfReader")
def test_endpoints_combined(mock_pdf_reader, mock_page):
    # Mock Wikipedia
    mock_page.return_value.content = "Wiki Mock"

    # Mock PDF pages
    mock_pdf_page = MagicMock()
    mock_pdf_page.extract_text.return_value = "PDF Mock"
    mock_pdf_reader.return_value.pages = [mock_pdf_page]

    # Test Wikipedia endpoint
    response_wiki = client.post("/ingest/wikipedia", data={"keyword": "Python"})
    assert response_wiki.status_code == 200
    assert response_wiki.json()["text"] == "Wiki Mock"

    # Test PDF endpoint
    file_content = b"Fake PDF content"
    response_pdf = client.post(
        "/ingest/pdf",
        files={"file": ("dummy.pdf", file_content, "application/pdf")}
    )
    assert response_pdf.status_code == 200
    assert response_pdf.json()["text"] == "PDF Mock"