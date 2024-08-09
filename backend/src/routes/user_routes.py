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

class AssignDisciplinesRequest(BaseModel):
    user_id: str
    course_id: str
    discipline_ids: List[str]
    type_help: str

class DeleteDisciplinesRequest(BaseModel):
    user_id: str
    course_id: str
    discipline_ids: List[str]
    type_help: str


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

@router.get("/disciplines/saved/seekers", response_model=List[DisciplineResponse])
def get_saved_seekers_disciplines(user_id: str, user: UserControl = Depends(get_user)):
    """
    Obtém todas as disciplinas salvas por um usuário na coleção 'seekers_disciplines'.

    :param user_id: ID do usuário.
    :param user: Instância do UserControl.
    :return: Lista de disciplinas salvas.
    """
    try:
        discipline_ids = user.get_saved_disciplines(user_id, type_help="seek_help")
        course_id = "yvm1KcPdwS1i64VPsj9Y"  # Substitua pelo ID do curso apropriado, se necessário
        disciplines = user.get_disciplines_details(course_id, discipline_ids)
        return [DisciplineResponse(
            id=d.id,
            name=d.name,
            code=d.code,
            semester=d.semester
        ) for d in disciplines]
    except Exception as e:
        logging.error(f"Error retrieving saved seekers disciplines: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})

@router.get("/disciplines/saved/helpers", response_model=List[DisciplineResponse])
def get_saved_helpers_disciplines(user_id: str, user: UserControl = Depends(get_user)):
    """
    Obtém todas as disciplinas salvas por um usuário na coleção 'helpers_disciplines'.

    :param user_id: ID do usuário.
    :param user: Instância do UserControl.
    :return: Lista de disciplinas salvas.
    """
    try:
        discipline_ids = user.get_saved_disciplines(user_id, type_help="offer_help")
        course_id = "yvm1KcPdwS1i64VPsj9Y"  # Substitua pelo ID do curso apropriado, se necessário
        disciplines = user.get_disciplines_details(course_id, discipline_ids)
        return [DisciplineResponse(
            id=d.id,
            name=d.name,
            code=d.code,
            semester=d.semester
        ) for d in disciplines]
    except Exception as e:
        logging.error(f"Error retrieving saved helpers disciplines: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})


@router.post("/disciplines/assign", status_code=200)
def assign_user_to_disciplines(request: AssignDisciplinesRequest, user: UserControl = Depends(get_user)):
    """
    Atribui um usuário a várias disciplinas e atualiza as coleções 'helpers' ou 'seekers'.

    :param request: Dados da requisição contendo user_id, course_id, discipline_ids, e type_help.
    :param user: Instância do UserControl.
    """
    try:
        # Chama o método no UserControl para adicionar as disciplinas ao usuário
        user.assign_user_to_disciplines(
            user_id=request.user_id,
            course_id=request.course_id,
            discipline_ids=request.discipline_ids,
            type_help=request.type_help
        )
        return {"message": "User successfully assigned to disciplines"}
    except ValueError as ve:
        logging.error(f"Value error assigning user to disciplines: {str(ve)}")
        raise HTTPException(status_code=400, detail={"error": str(ve)})
    except Exception as e:
        logging.error(f"Error assigning user to disciplines: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})


@router.put("/disciplines/update", status_code=200)
def update_user_disciplines(request: AssignDisciplinesRequest, user: UserControl = Depends(get_user)):
    """
    Atualiza as disciplinas de um usuário, removendo as antigas e adicionando as novas.

    :param request: Dados da requisição contendo user_id, course_id, discipline_ids, e type_help.
    :param user: Instância do UserControl.
    """
    try:
        # Chama o método no UserControl para atualizar as disciplinas do usuário
        user.update_user_disciplines(
            user_id=request.user_id,
            course_id=request.course_id,
            new_discipline_ids=request.discipline_ids,
            type_help=request.type_help
        )
        return {"message": "User disciplines successfully updated"}
    except ValueError as ve:
        logging.error(f"Value error updating user disciplines: {str(ve)}")
        raise HTTPException(status_code=400, detail={"error": str(ve)})
    except Exception as e:
        logging.error(f"Error updating user disciplines: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})

@router.delete("/disciplines/remove", status_code=200)
def remove_user_disciplines(request: DeleteDisciplinesRequest, user: UserControl = Depends(get_user)):
    """
    Remove disciplinas específicas do usuário.

    :param request: Dados da requisição contendo user_id, course_id, discipline_ids, e type_help.
    :param user: Instância do UserControl.
    """
    try:
        # Chama o método no UserControl para remover as disciplinas do usuário
        user.remove_user_from_disciplines(
            user_id=request.user_id,
            course_id=request.course_id,
            discipline_ids=request.discipline_ids,
            type_help=request.type_help
        )
        return {"message": "User disciplines successfully removed"}
    except ValueError as ve:
        logging.error(f"Value error removing user disciplines: {str(ve)}")
        raise HTTPException(status_code=400, detail={"error": str(ve)})
    except Exception as e:
        logging.error(f"Error removing user disciplines: {str(e)}")
        raise HTTPException(status_code=500, detail={"error": "Internal server error"})
