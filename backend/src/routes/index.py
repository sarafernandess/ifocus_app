from fastapi import APIRouter

from src.routes import auth, home

router = APIRouter()

router.include_router(auth.router, tags=["auth"])
router.include_router(home.router, tags=["home"])
