from fastapi import APIRouter

from src.controllers.home_controller import HomeController

router = APIRouter()

home_controller = HomeController()


@router.get("/")
async def read_home():
    return home_controller.get_welcome_message()
