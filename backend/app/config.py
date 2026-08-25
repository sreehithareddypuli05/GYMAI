from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central app configuration, loaded from environment variables (.env in dev).
    DATABASE_URL defaults to SQLite for local development but is written as a
    standard SQLAlchemy URL, so swapping to Postgres in production is just a
    matter of setting DATABASE_URL=postgresql://... — no code changes needed.
    """

    database_url: str = "sqlite:///./gymai.db"
    secret_key: str = "dev-only-secret-key-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
