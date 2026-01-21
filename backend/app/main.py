from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.base import Base
from app.db.session import engine
from app.routes.health import router as health_router
from app.routes.auth_routes import router as auth_router
from app.routes.ingestion_routes import router as ingestion_router
from app.routes.action_routes import router as action_router
import app.db.models



@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP code
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    yield



app = FastAPI(lifespan=lifespan)


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(ingestion_router)
app.include_router(action_router)


@app.get('/')
def main():
    return {'message': 'running'}