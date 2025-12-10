# app/config.py
# This file stores settings for our app.
# Think of it like a configuration sheet for the project.

from pydantic_settings import BaseSettings   # <-- changed this line

class Settings(BaseSettings):
    """
    This class reads settings from environment variables or a .env file.
    For now we only care about the DATABASE_URL.
    """

    # For SQLite:
    DATABASE_URL: str = "sqlite:///./emotion_clips.db"

    class Config:
        # This tells Pydantic to also look into a file called ".env"
        env_file = ".env"

# We create one global settings object to use everywhere.
settings = Settings()
