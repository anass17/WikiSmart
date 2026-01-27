from unittest.mock import patch, MagicMock
from fastapi import HTTPException

def test_ingest_wikipedia_success(client):
    payload = {
        "ressource": "Python",
        "method": "keyword",
        "lang": "en"
    }

    mock_article = {
        "id": 1,
        "title": "Python",
        "url": "https://en.wikipedia.org/wiki/python",
        "content": "Python is a programming language"
    }

    with patch(
        "app.controllers.ingestion_controller.IngestionController.get_wikipedia_article",
        return_value=mock_article
    ):
        response = client.post(
            "/ingest/wikipedia",
            json=payload,
            headers={"Authorization": "Bearer fake-token"}
        )

    assert response.status_code == 200
    assert response.json()["title"] == "Python"




def test_ingest_wikipedia_invalid_url(client):
    payload = {
        "ressource": "https://google.com",
        "method": "url",
        "lang": "en"
    }

    with patch(
        "app.controllers.ingestion_controller.IngestionController.get_wikipedia_article",
        side_effect=HTTPException(status_code=400, detail="Ce n'est pas une URL Wikipedia")
    ):
        response = client.post(
            "/ingest/wikipedia",
            json=payload,
            headers={"Authorization": "Bearer fake-token"}
        )

    assert response.status_code == 400