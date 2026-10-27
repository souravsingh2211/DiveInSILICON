from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
import jwt
import requests

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


class GoogleLoginIn(BaseModel):
    access_token: str


def auth_response(u: User):
    return {
        "access_token": make_token(u.id),
        "token_type": "bearer",
        "user": {
            "id": u.id,
            "name": u.name,
            "email": u.email,
        },
    }


@router.post("/signup")
def signup(d: SignupIn, db: Session = Depends(get_db)):
    email = d.email.strip().lower()

    if len(d.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists",
        )

    u = User(
        name=d.name.strip(),
        email=email,
        password_hash=hash_password(d.password),
    )

    db.add(u)
    db.commit()
    db.refresh(u)

    return auth_response(u)


@router.post("/login")
def login(d: LoginIn, db: Session = Depends(get_db)):
    email = d.email.strip().lower()

    u = db.query(User).filter(User.email == email).first()

    if (
        not u
        or not u.password_hash
        or not verify_password(d.password, u.password_hash)
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
        )

    return auth_response(u)


@router.post("/google")
def google_login(d: GoogleLoginIn, db: Session = Depends(get_db)):
    try:
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={
                "Authorization": f"Bearer {d.access_token}",
            },
            timeout=10,
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Could not contact Google. Please try again.",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Google sign-in failed. Please try again.",
        )

    google_user = response.json()

    email = google_user.get("email", "").strip().lower()
    name = google_user.get("name", "").strip()
    email_verified = google_user.get("email_verified", False)

    if not email or not name or email_verified is not True:
        raise HTTPException(
            status_code=401,
            detail="Google account email could not be verified.",
        )

    user = db.query(User).filter(User.email == email).first()

    if user:
        # Do not automatically link Google to an existing password account.
        if user.password_hash:
            raise HTTPException(
                status_code=409,
                detail=(
                    "This email already has a password account. "
                    "Please log in with your password."
                ),
            )
    else:
        user = User(
            name=name,
            email=email,
            password_hash=None,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    return auth_response(user)


def current_user(
    cred=Depends(bearer),
    db: Session = Depends(get_db),
):
    if not cred:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    try:
        uid = int(
            jwt.decode(
                cred.credentials,
                SECRET,
                algorithms=["HS256"],
            )["sub"]
        )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    u = db.get(User, uid)

    if not u:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    return u


@router.get("/me")
def me(u: User = Depends(current_user)):
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
    }
