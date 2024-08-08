import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel

from admin_control import AdminControl
from models import Course, Discipline as DisciplineModel, CourseResponse, CourseCreate
from src.controllers.auth_control import AuthControl, oauth2_scheme

router = APIRouter()
auth_control = AuthControl()


class DisciplineCreate(BaseModel):
    id: Optional[str]
    name: str
    code: str
    semester: int

class DisciplineResponse(BaseModel):
    id: str
    name: str
    code: str
    semester: int

def get_current_admin(token: str = Depends(oauth2_scheme)) -> AdminControl:
    user = auth_control.is_admin(token)
    return AdminControl(user)

@router.post("/courses", response_model=CourseResponse, status_code=201)
def create_course(course: CourseCreate, admin: AdminControl = Depends(get_current_admin)):
    try:
        # Cria o curso com o nome e código fornecidos
        created_course_id = admin.create_course(id=None, name=course.name, code=course.code)
        created_course = Course(id=created_course_id, name=course.name, code=course.code)
        return CourseResponse(id=created_course.id, name=created_course.name, code=created_course.code)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Error creating course: {str(e)}"})


@router.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id: str, course: CourseCreate, admin: AdminControl = Depends(get_current_admin)):
    try:
        course_model = Course(uid=course_id, name=course.name, code=course.code)
        admin.update_course(course_id, name=course_model.name, code=course_model.code)
        updated_course = admin.get_course(course_id)
        if not updated_course:
            raise HTTPException(status_code=404, detail={"error": "Course not found"})
        return CourseResponse(uid=updated_course.uid, name=updated_course.name, code=updated_course.code)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Error updating course: {str(e)}"})

@router.delete("/courses/{course_id}", status_code=204)
def delete_course(course_id: str, admin: AdminControl = Depends(get_current_admin)):
    try:
        admin.delete_course(course_id)
        return Response(status_code=204)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Error deleting course: {str(e)}"})

@router.post("/courses/{course_id}/disciplines", response_model=DisciplineResponse, status_code=201)
def create_discipline(course_id: str, discipline: DisciplineCreate, admin: AdminControl = Depends(get_current_admin)):
    try:
        discipline_model = DisciplineModel(id=None, name=discipline.name, code=discipline.code, semester=discipline.semester)
        discipline_id = admin.create_discipline(course_id=course_id, id=discipline_model.id, name=discipline_model.name,
                                                     code=discipline_model.code, semester=discipline_model.semester)
        created_discipline = DisciplineModel(id=discipline_id, name=discipline.name,
                                             code=discipline.code, semester=discipline.semester)
        return DisciplineResponse(id=created_discipline.id, name=created_discipline.name,
                                  code=created_discipline.code, semester=created_discipline.semester)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Error creating discipline: {str(e)}"})

@router.put("/courses/{course_id}/disciplines/{discipline_id}", response_model=DisciplineResponse)
def update_discipline(course_id: str, discipline_id: str, discipline: DisciplineCreate, admin: AdminControl = Depends(get_current_admin)):
    try:
        discipline_model = DisciplineModel(uid=discipline_id, name=discipline.name, code=discipline.code, semester=discipline.semester)
        admin.update_discipline(course_id, discipline_id, name=discipline_model.name, code=discipline_model.code, semester=discipline_model.semester)
        updated_discipline = admin.get_discipline(course_id, discipline_id)
        if not updated_discipline:
            raise HTTPException(status_code=404, detail={"error": "Discipline not found"})
        return DisciplineResponse(uid=updated_discipline.uid, name=updated_discipline.name, code=updated_discipline.code, semester=updated_discipline.semester)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Error updating discipline: {str(e)}"})

@router.delete("/courses/{course_id}/disciplines/{discipline_id}", status_code=204)
def delete_discipline(course_id: str, discipline_id: str, admin: AdminControl = Depends(get_current_admin)):
    try:
        admin.delete_discipline(course_id, discipline_id)
        return Response(status_code=204)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"error": f"Error deleting discipline: {str(e)}"})
