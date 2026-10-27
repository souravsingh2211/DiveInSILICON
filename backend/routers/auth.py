from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
import jwt

from database import get_db
from models import User
from security import hash_password, verify_password, make_token, SECRET

router = APIRouter(prefix="/api/auth")
bearer = HTTPBearer(auto_error=False)

class SignupIn(BaseModel):
    name: str
    email: str
    password: str

class LoginIn(BaseModel):
    email: str
    password: str

def auth_response(u: User):
    return {
        "access_token": make_token(u.id),
        "token_type": "bearer",
        "user": {"id": u.id, "name": u.name, "email": u.email},
    }

@router.post("/signup")
def signup(d: SignupIn, db: Session = Depends(get_db)):
    email = d.email.strip().lower()

    if len(d.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(409, "An account with this email already exists")
    u = User(name=d.name.strip(), email=email, password_hash=hash_password(d.password))
    db.add(u)
    db.commit()
    db.refresh(u)
    return auth_response(u)

@router.post("/login")
def login(d: LoginIn, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == d.email.strip().lower()).first()
    if not u or not u.password_hash or not verify_password(d.password, u.password_hash):
        raise HTTPException(401, "Incorrect email or password")
    return auth_response(u)

def current_user(cred=Depends(bearer), db: Session = Depends(get_db)):
    if not cred:
        raise HTTPException(401, "Invalid or expired token")
    try:
        uid = int(jwt.decode(cred.credentials, SECRET, algorithms=["HS256"])["sub"])
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
    u = db.get(User, uid)
    if not u:
        raise HTTPException(401, "Invalid or expired token")
    return u

@router.get("/me")
def me(u: User = Depends(current_user)):
    return {"id": u.id, "name": u.name, "email": u.email}