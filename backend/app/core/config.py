from pathlib import Path

from functools import lru_cache
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

# .env path relative to backend/
_env_path = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_env_path, extra="ignore")

    database_url: str = "sqlite:///./smrt.db"


@lru_cache
def get_settings() -> Settings:
    return Settings()
