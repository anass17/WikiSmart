from unittest.mock import MagicMock
from app.controllers.action_controller import ActionController
from app.schemas.summary_format import SummaryFormat


def test_summarize_section_success():

    controller = ActionController()

    # Fake réponse Groq
    fake_response = MagicMock()
    fake_response.choices = [
        MagicMock(
            message=MagicMock(
                content="Résumé mocké"
            )
        )
    ]

    # Fake client Groq
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = fake_response

    result = controller.summarize_section(
        subject="subject",
        title="Introduction",
        text="Texte long",
        format=SummaryFormat.court
    )

    assert result == "Résumé mocké"