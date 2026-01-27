from unittest.mock import MagicMock
from app.controllers.action_controller import ActionController


def test_generate_qcm():

    # Fake DB
    fake_db = MagicMock()

    # Fake article
    fake_article = MagicMock()
    fake_article.id = 1
    fake_article.content = "Contenu test"

    fake_client = MagicMock()
    fake_client.models.generate_content.return_value.text = """[
        {
            "question": "Question ?",
            "options": ["A", "B", "C", "D"],
            "answer": "A"
        }
    ]"""

    controller = ActionController(
        db=fake_db,
        gemini_client=fake_client
    )

    controller.article_model = MagicMock()
    controller.model = MagicMock()
    controller.quiz_model = MagicMock()

    controller.article_model.get_article_by_id.return_value = fake_article
    controller.model.create_action.return_value = MagicMock(id=10)
    controller.quiz_model.create_quiz.return_value = MagicMock(id=99)

    result = controller.generate_quiz(
        article_id=1,
        n_questions=1,
        user_id=42
    )

    assert result["quiz_id"] == 99
    assert result["quiz"][0]["answer"] == "A"