from unittest.mock import MagicMock
from app.schemas.summary_format import SummaryFormat
from app.controllers.action_controller import ActionController
import pytest


def test_summarize_section_success():
    # -----------------------
    # Arrange
    # -----------------------
    fake_db = MagicMock()

    fake_article = MagicMock()
    fake_article.id = 1
    fake_article.content = "Ceci est un long contenu Wikipédia."

    fake_response = MagicMock()
    fake_response.choices = [
        MagicMock(
            message=MagicMock(
                content="Résumé court généré."
            )
        )
    ]

    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = fake_response

    controller = ActionController(
        db=fake_db,
        groq_client=fake_client
    )

    controller.article_model = MagicMock()
    controller.model = MagicMock()

    controller.article_model.get_article_by_id.return_value = fake_article

    # -----------------------
    # Act
    # -----------------------
    result = controller.summarize_section(
        article_id=1,
        format=SummaryFormat.court,
        user_id=42
    )

    # -----------------------
    # Assert
    # -----------------------
    assert result == "Résumé court généré."

    controller.article_model.get_article_by_id.assert_called_once_with(1)

    fake_client.chat.completions.create.assert_called_once()

    controller.model.create_action.assert_called_once_with(
        42,
        1,
        "SUMMERIZE",
        SummaryFormat.court.value
    )