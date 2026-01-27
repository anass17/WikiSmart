# from unittest.mock import MagicMock
# from app.controllers.action_controller import ActionController


# def test_generate_qcm():
#     fake_client = MagicMock()
#     fake_client.models.generate_content.return_value.text = [
#         {
#             'question': "Quel terme technique ... ?",
#             'options': ["Transmettre une information, ..."],
#             'answer': "Transmettre une information"
#         }
#     ]

#     controller = ActionController(gemini_client=fake_client)
#     result = controller.generate_qcm("texte", 3)

#     assert isinstance(result, list)
#     assert result[0]['answer'] == "Transmettre une information"