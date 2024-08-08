# src/routes/user_routes.py
import logging
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel

from admin_routes import DisciplineResponse
from src.controllers.auth_control import AuthControl, oauth2_scheme
from models import CourseResponse
from user_control import UserControl

router = APIRouter()
auth_control = AuthControl()


def get_user(token: str = Depends(oauth2_scheme)) -> UserControl:
    user = auth_control.get_current_user(token)
    return UserControl(user)


@router.get("/courses", response_model=List[CourseResponse])
def get_courses(course_id: Optional[str] = Query(None), user: UserControl = Depends(get_user)):
    try:
        if course_id:
            course = user.get_course(course_id)
            if not course:
                raise HTTPException(status_code=404, detail={"error": "Course not found"})
            # Criar e retornar uma instância de CourseResponse
            return CourseResponse.from_course(course)
        else:
            all_courses = user.get_all_courses()
            # Criar e retornar uma lista de CourseResponse
            return [CourseResponse.from_course(c) for c in all_courses]
    except Exception as e:
        logging.error(f"Error retrieving courses: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})


@router.get("/courses/{course_id}/disciplines", response_model=List[DisciplineResponse])
def get_disciplines(course_id: str,discipline_id: Optional[str] = Query(None), user: UserControl = Depends(get_user)):
    try:
        if discipline_id:
            # Buscar uma única disciplina associada ao course_id
            discipline = user.get_discipline(course_id=course_id, discipline_id=discipline_id)
            if not discipline:
                raise HTTPException(status_code=404, detail="Discipline not found")
            return DisciplineResponse(
                id=discipline.id,
                name=discipline.name,
                code=discipline.code,
                semester=discipline.semester
            )
        else:
            # Buscar todas as disciplinas associadas ao course_id
            all_disciplines = user.get_all_disciplines(course_id=course_id)
            return [
                DisciplineResponse(
                    id=d.id,
                    name=d.name,
                    code=d.code,
                    semester=d.semester
                )
                for d in all_disciplines
            ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error retrieving disciplines: {str(e)}")


