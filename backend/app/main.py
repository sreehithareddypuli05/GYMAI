from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine

from app import models

from app.routers import (
    auth,
    dashboard,
    workouts,
    history,
    progress,
)


Base.metadata.create_all(
    bind=engine,
)


app = FastAPI(
    title="GymAI API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(workouts.router)
app.include_router(history.router)
app.include_router(progress.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "GymAI API",
    }