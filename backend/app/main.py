# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import jobs_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Emotion Clip Backend",
    description="Backend for AI clip generation from videos.",
    version="0.1.0",
)

# Allow your frontend and dev tools
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs_router)


@app.get("/")
def read_root():
    return {"message": "Emotion Clip Backend is running!"}
# End of app/main.py