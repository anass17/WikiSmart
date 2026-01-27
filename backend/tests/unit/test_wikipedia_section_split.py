# from app.controllers.ingestion_controller import IngestionController

# def test_split_multiple_sections():
#     controller = IngestionController()

#     content = """
#     === Introduction ===
#     Texte intro.

#     === Historique ===
#     Texte historique.

#     === Applications ===
#     Texte applications.
#     """

#     result = controller.split_wikipedia_sections(content)

#     assert result == {
#         "Introduction": "Texte intro.",
#         "Historique": "Texte historique.",
#         "Applications": "Texte applications.",
#     }



# def test_split_with_text_before_first_section():
#     controller = IngestionController()

#     content = """
#     Python est un langage populaire.

#     === Historique ===
#     Créé par Guido van Rossum.
#     """

#     result = controller.split_wikipedia_sections(content)

#     assert result["Introduction"] == "Python est un langage populaire."
#     assert result["Historique"] == "Créé par Guido van Rossum."



# def test_split_without_sections():
#     controller = IngestionController()

#     content = "Python est un langage de programmation."

#     result = controller.split_wikipedia_sections(content)

#     assert result == {
#         "Introduction": "Python est un langage de programmation."
#     }



# def test_split_empty_section_content():
#     controller = IngestionController()

#     content = """
#     === Introduction ===

#     === Historique ===
#     Historique ici.
#     """

#     result = controller.split_wikipedia_sections(content)

#     assert result["Introduction"] == ""
#     assert result["Historique"] == "Historique ici."
