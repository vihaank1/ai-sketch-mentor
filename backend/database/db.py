from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./artmentor.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

from sqlalchemy import Column, Integer, String, JSON

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)

    anatomy = Column(Integer, default=0)
    shading = Column(Integer, default=0)
    perspective = Column(Integer, default=0)
    composition = Column(Integer, default=0)
    line_confidence = Column(Integer, default=0)

    streak = Column(Integer, default=0)
    history = Column(JSON, default=list)