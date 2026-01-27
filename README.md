# WikiSmart - Plateforme éducative intelligente propulsée par l'IA

Une plateforme innovante conçue pour optimiser l'apprentissage autonome. En exploitant la puissance des modèles de langage (LLM), elle permet de transformer des articles Wikipédia complexes ou des documents PDF en ressources pédagogiques digestes : résumés, traductions et quiz interactifs.

## Vision du Projet

Face à la surcharge informationnelle, WikiSmart Edu réduit le temps de compréhension tout en renforçant la rétention des connaissances grâce à :

- **La Synthèse :** Extraction de l'essentiel.
- **L'Accessibilité :** Traduction multilingue.
- **L'Évaluation :** Génération dynamique de QCM (JSON).
- **Le Suivi :** Analyse de progression et historique personnalisé.

## Stack Technique

### Backend (Cœur Intelligent)

- **Framework :** FastAPI
- **Base de données :** PostgreSQL avec SQLAlchemy (ORM)
- **Validation & Config :** Pydantic & Pydantic-settings
- **Sécurité :** OAuth 2.0 + JWT (JSON Web Tokens).

### Intelligence Artificielle & Traitement

- **LLMs :**
    - **Groq :** Optimisé pour la vitesse (Résumés).
    - **Google Gemini :** Pour la traduction et la génération de quiz complexes.
- **Extraction de contenu :** Bibliothèques wikipedia (avec User-Agent) et LangChain (pour les PDF).
- **Prétraitement :** urllib.parse pour le nettoyage des tags et segmentation structurée des sections.

### Frontend & DevOps

- **Frontend :** React.js (Interface moderne et réactive)
- **Conteneurisation :** Docker & Docker Compose
- **Tests :** Pytest avec Mocks complets pour les APIs Groq et Gemini.

## Fonctionnalités Clés

**1. Ingestion de Contenu**

- **Wikipedia :** Extraction intelligente via URL (nettoyage des underscores, segmentation par sections ===).
- **PDF :** Téléchargement et parsing de documents via LangChain.

**2. Traitement IA (Prompt Engineering)**

- **Résumé :** Choix du format (Court ou Moyen) via Groq.
- **Traduction :** Support multilingue (FR, EN, AR, ES).
- **Génération de Quiz :** QCM à 4 options et questions ouvertes, retournés au format JSON strict.

**3. Gestion des Rôles**

| Rôle              | Permissions |
| ----------------- | ----------- |
| Utilisateur       | Ingestion, Actions IA, Historique, Scores aux Quiz. |
| Administrateur    | Statistiques globales (Inscriptions, Volumes d'articles, QCM générés). |


## Installation et Configuration

### Prérequis

- Docker & Docker Compose
- Clés API : Groq et Google Gemini

### Installation

**1. Cloner le dépôt :**

```Bash
git clone https://github.com/anass17/WikiSmart.git
cd WikiSmart
```

**2. Configurer les variables d'environnement :**

Copier le fichier d’exemple :

```Bash
cp .env_example .env
```

Modifier le fichier `.env` et renseigner les variables d’environnement nécessaires

**3. Génération de la clé secrète JWT :**

Générer une clé secrète sécurisée pour la signature des tokens JWT :

```Bash
openssl rand -base64 32
```

- Copier la clé générée
- La renseigner dans le fichier .env (ex : SECRET_KEY=...)

**4. Lancer avec Docker :**

```Bash
docker-compose up --build
```

**5. Accès à l’application :**

Une fois l’application démarrée :

- Accès à l’API :
`http://localhost:8000`

- Accès à la documentation interactive :
`http://localhost:8000/docs`

- Accès à l'application React :
`http://localhost:3000/login`

### Tests & Qualité

Le projet maintient un haut standard de qualité via des tests unitaires :

```Bash
pytest tests/
```

**Note :** Les API externes sont mockées pour garantir des tests rapides et sans coût.

## Visualisations

## Home Page

![Home Page](https://github.com/user-attachments/assets/9c1efab8-b864-42fe-a9cb-e87f17887a9e)

## Admin Dashboard

![Dashboard](https://github.com/user-attachments/assets/6eec6a55-7d5f-4752-807e-f1c6138b7c59)

## Quizzes List

![Quizzes](https://github.com/user-attachments/assets/5430b9ec-a7c8-4cac-a251-426b2395d385)

## Actions History

![History](https://github.com/user-attachments/assets/ae37ef43-f954-4c48-9932-7f36f1020afc)

## Quiz Attempt

![Quiz](https://github.com/user-attachments/assets/7238a63b-c2f6-4198-b6be-62a794b2dfb5)

## Ingestion

![Ingestion](https://github.com/user-attachments/assets/0a5bf868-4957-4b40-b265-3931506917ba)

## Fast API Endpoints

![Fast API](https://github.com/user-attachments/assets/402a907c-b860-443e-a95f-134a9f70fe73)
