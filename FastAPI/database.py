from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Actualiza con tus credenciales reales de PostgreSQL - http://127.0.0.1:8000/docs
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:12345@localhost:5432/DB_Academico"


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()