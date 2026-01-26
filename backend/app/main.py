from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.base import Base
from app.db.session import engine
from app.routes.health import router as health_router
from app.routes.auth_routes import router as auth_router
from app.routes.ingestion_routes import router as ingestion_router
from app.routes.action_routes import router as action_router
from app.routes.quiz_routes import router as quiz_router
from app.routes.statistics_routes import router as statistics_router
import app.db.models

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",   # dev on host
    "http://frontend:3000",    # frontend container
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP code
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    yield



app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(health_router)
app.include_router(auth_router)
app.include_router(ingestion_router)
app.include_router(action_router)
app.include_router(quiz_router)
app.include_router(statistics_router)


@app.get('/')
def main():
    return {'message': 'running'}