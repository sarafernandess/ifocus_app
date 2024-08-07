from abc import ABC, abstractmethod
from typing import Optional

from data.database import Db
from models import Course, Discipline


def convert_to_dict(data):
    if isinstance(data, tuple):
        # Se for uma tupla, converta-a para um dicionário se você souber o formato
        return dict(zip(['name', 'code', 'semester'], data))
    return data


class CRUD(ABC):
    @staticmethod
    @abstractmethod
    def create(data, document_id=None):
        """Cria um novo documento. Se `document_id` for fornecido, usa-o, caso contrário, gera um novo ID."""
        pass

    @staticmethod
    @abstractmethod
    def get(document_id):
        """Obtém um documento pelo seu ID."""
        pass

    @staticmethod
    @abstractmethod
    def update(document_id, updates):
        """Atualiza um documento existente com os dados fornecidos."""
        pass

    @staticmethod
    @abstractmethod
    def delete(document_id):
        """Deleta um documento pelo seu ID."""
        pass

    @staticmethod
    @abstractmethod
    def get_all():
        """Obtém todos os documentos. Pode retornar uma lista ou outro tipo de coleção."""
        pass

class CourseRepository(CRUD):

    @staticmethod
    def create(course: Course, course_id: Optional[str] = None) -> str:
        course_data = course.to_dict()
        # Cria o documento e obtém o ID gerado ou especificado
        document_id = Db.create_document('courses', course_data, course_id)
        # Retorna o ID do curso criado
        return document_id

    @staticmethod
    def get(document_id):
        data = Db.get_document('courses', document_id)
        if data:
            data = Course.from_dict(data)
            return data
        return None

    @staticmethod
    def update(document_id, updates):
        Db.update_document('courses', document_id, updates)

    @staticmethod
    def delete(document_id):
        Db.delete_document('courses', document_id)

    @staticmethod
    def delete_all():
        Db.delete_all_courses()

    @staticmethod
    def get_all():
        courses_data = Db.get_all_documents('courses')
        print("Courses data from DB:", courses_data)  # Adicione este print para depuração
        return [Course.from_dict(data) for data in courses_data]

class DisciplineRepository(CRUD):
    @staticmethod
    def create(data, document_id=None, course_id=None):
        """Cria uma nova disciplina. Se `document_id` for fornecido, usa-o, caso contrário, gera um novo ID."""
        if isinstance(data, Discipline):
            discipline = data
        elif isinstance(data, dict):
            discipline = Discipline.from_dict(data)
        else:
            raise ValueError(f"Data must be a dictionary or Discipline instance, got {type(data).__name__}")

        discipline_data = discipline.to_dict()
        if course_id:
            return Db.create_document(f'courses/{course_id}/disciplines', discipline_data, document_id)
        return Db.create_document('disciplines', discipline_data, document_id)

    @staticmethod
    def get(document_id, course_id=None):
        """Obtém uma disciplina pelo seu ID, opcionalmente dentro de um curso."""
        if course_id:
            data = Db.get_document(f'courses/{course_id}/disciplines', document_id)
        else:
            data = Db.get_document('disciplines', document_id)
        if data:
            return Discipline.from_dict(data)
        return None

    @staticmethod
    def update(document_id, updates, course_id=None):
        """Atualiza uma disciplina existente, opcionalmente dentro de um curso."""
        if course_id:
            Db.update_document(f'courses/{course_id}/disciplines', document_id, updates)
        else:
            Db.update_document('disciplines', document_id, updates)

    @staticmethod
    def delete(document_id, course_id=None):
        """Deleta uma disciplina pelo seu ID, opcionalmente dentro de um curso."""
        if course_id:
            Db.delete_document(f'courses/{course_id}/disciplines', document_id)
        else:
            Db.delete_document('disciplines', document_id)

    @staticmethod
    def get_all_disciplines_in_course(course_id=None):
        """Obtém todas as disciplinas, opcionalmente dentro de um curso."""
        if course_id:
            disciplines_data = Db.get_all_documents(f'courses/{course_id}/disciplines')
        else:
            disciplines_data = Db.get_all_documents('disciplines')
        return [Discipline.from_dict(data) for data in disciplines_data]
