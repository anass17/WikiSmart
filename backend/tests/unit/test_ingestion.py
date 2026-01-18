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