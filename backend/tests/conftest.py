import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.db.deps import get_db
from app.main import app
from app.core.deps import get_current_user


def override_get_current_user():
    return {
        "sub": "1", 
        "role": "USER"
    }

app.dependency_overrides[get_current_user] = override_get_current_user


# Crée une DB SQLite temporaire pour les tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Remplace la dépendance get_db par la session de test
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Création de toutes les tables
Base.metadata.create_all(bind=engine)

@pytest.fixture
def client():
    
    # Drop all tables first (clean slate)
    Base.metadata.drop_all(bind=engine)
    # Create tables
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as c:
        yield c
