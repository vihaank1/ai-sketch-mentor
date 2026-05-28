from sqlalchemy import Column, Integer, String, Float
from database.db import Base

class Progress(Base):

    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String)

    anatomy = Column(Float, default=0)
    shading = Column(Float, default=0)
    perspective = Column(Float, default=0)
    composition = Column(Float, default=0)
    line_confidence = Column(Float, default=0)

    streak = Column(Float, default=0)

    art_style = Column(Float, default="general")

    level = Column(Float, default="beginner")
    
