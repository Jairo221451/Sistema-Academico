from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# http://127.0.0.1:8000/docs
URL_DATABASE = "postgresql://postgres:12345@localhost:5432/DB_UnionNuevosInteligentes"

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()