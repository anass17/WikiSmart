import pytest
from app.controllers.ingestion_controller import IngestionController
from app.db.deps import get_db

controller = IngestionController(db=None)


def test_normalize_wikipedia_title_valid():
    url = "https://fr.wikipedia.org/wiki/Machine_Learning"
    [lang, title] = controller.extract_wikipedia_title(url)

    assert title == "Machine Learning"
    assert lang == "fr"



def test_normalize_wikipedia_invalid_domain():
    url = "https://google.com/wiki/Python"

    with pytest.raises(ValueError, match="URL Wikipedia"):
        controller.extract_wikipedia_title(url)



def test_normalize_wikipedia_invalid_path():
    url = "https://fr.wikipedia.org/Python"

    with pytest.raises(ValueError, match="Chemin Wikipedia"):
        controller.extract_wikipedia_title(url)