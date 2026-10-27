from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Google users ke liye khali
    created_at = Column(DateTime, server_default=func.now())