# src/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from data_manager import DataManager
from models import User

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    user = DataManager.get_user_by_email(request.email)
    if user and user.authenticate(request.password):
        # Se o usuário for um administrador
        if user.is_admin():
            return {"message": "Login successful. Welcome, admin!"}
        # Se o usuário for um aluno
        return {"message": "Login successful. Welcome, student!"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
