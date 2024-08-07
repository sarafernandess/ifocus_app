# src/routes/user_routes.py
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from user_control import UserControl

router = APIRouter()
user_controller = UserControl()

class UserCreateRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    phone: Optional[str] = None

class UserUpdateRoleRequest(BaseModel):
    role: str

uid = []
@router.post("/register")
async def create_user(request: UserCreateRequest):
    try:
        user_id = user_controller.create_user(
            name=request.name,
            email=request.email,
            password=request.password,
            phone=request.phone,
            role=request.role
        )
        if user_id:
            uid.append(user_id)
            return {"user_id": user_id}
        else:
            raise HTTPException(status_code=400, detail="Error creating user")
    except Exception as e:
        # Log the error for internal debugging
        logging.error(f"Error creating user: {e}")
        # Return a more generic error message to the user
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/users/{uid}")
async def get_user(uid: str):
    user = user_controller.get_user(uid)
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.put("/users/{uid}/role")
async def update_user_role(uid: str, request: UserUpdateRoleRequest):
    success = user_controller.update_user_role(uid, request.role)
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Error updating user role")

@router.delete("/users/{uid}")
async def delete_user(uid: str):
    success = user_controller.delete_user(uid)
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Error deleting user")
