from abc import ABC, abstractmethod
from typing import Optional, List

from google.cloud import firestore

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
    def create(data, document_id=None, course_id=None): #todo - ajustar tipo de course id
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

    @staticmethod
    def add_user_to_disciplines(user_id: str, course_id: str, discipline_ids: List[str], type_help: str):
        """
        Adiciona um usuário a várias disciplinas nas coleções 'helpers' ou 'seekers'.

        :param user_id: ID do usuário.
        :param course_id: ID do curso.
        :param discipline_ids: Lista de IDs das disciplinas.
        :param type_help: Tipo de ajuda, 'offer_help' para helpers e 'seek_help' para seekers.
        :raises ValueError: Se course_id ou discipline_ids não forem fornecidos.
        """
        if not course_id or not discipline_ids:
            raise ValueError("É necessário fornecer o ID do curso e uma lista de IDs das disciplinas.")

        collection_name = "helpers" if type_help == "offer_help" else "seekers"

        for discipline_id in discipline_ids:
            # Define o caminho correto até a disciplina
            discipline_collection_path = f'courses/{course_id}/disciplines'

            # Recupera o documento atual para obter os helpers ou seekers existentes
            existing_document = Db.get_document(discipline_collection_path, discipline_id)

            # Verifica se a lista já existe, caso contrário cria uma nova
            existing_users = existing_document.get(collection_name, [])

            # Adiciona o novo user_id à lista se ele ainda não estiver presente
            if user_id not in existing_users:
                existing_users.append(user_id)

            updates = {collection_name: existing_users}

            Db.update_document(discipline_collection_path, discipline_id, updates)

    @staticmethod
    def remove_user_from_discipline(user_id: str, discipline_id: str, type_help: str, course_id: str = None):
        """
        Remove um usuário de uma disciplina nas coleções 'helpers' ou 'seekers'.
        """
        collection_name = "helpers" if type_help == "offer_help" else "seekers"
        discipline_collection_path = f'courses/{course_id}/disciplines' if course_id else 'disciplines'

        existing_document = Db.get_document(discipline_collection_path, discipline_id)
        existing_users = existing_document.get(collection_name, [])

        if user_id in existing_users:
            existing_users.remove(user_id)
            updates = {collection_name: existing_users}
            Db.update_document(discipline_collection_path, discipline_id, updates)

class UserRepository(CRUD):

    @staticmethod
    def get(document_id: str):
        """
        Obtém um usuário pelo seu ID.

        :param document_id: ID do usuário.
        :return: Dados do usuário.
        """
        return Db.get_document('users', document_id)

    @staticmethod
    def add_discipline_to_user(user_id: str, discipline_ids: List[str], type_help: str):
        """
        Adiciona uma lista de IDs de disciplinas ao documento do usuário na coleção 'disciplines'.
        """
        updates = {}
        if type_help == "offer_help":
            updates['helpers_disciplines'] = firestore.ArrayUnion(discipline_ids)
        else:
            updates['seekers_disciplines'] = firestore.ArrayUnion(discipline_ids)

        Db.update_document('users', user_id, updates)

    @staticmethod
    def update_user_disciplines(user_id: str, new_discipline_ids: List[str], type_help: str):
        """
        Atualiza as disciplinas de um usuário.
        """
        collection_name = "helpers_disciplines" if type_help == "offer_help" else "seekers_disciplines"
        updates = {collection_name: new_discipline_ids}
        Db.update_document('users', user_id, updates)

    @staticmethod
    def remove_disciplines_from_user(user_id: str, discipline_ids: List[str], type_help: str):
        """
        Remove IDs de disciplinas de um usuário na coleção 'seekers_disciplines' ou 'helpers_disciplines'.

        :param user_id: ID do usuário.
        :param discipline_ids: Lista de IDs das disciplinas a serem removidas.
        :param type_help: Tipo de ajuda, 'offer_help' para helpers e 'seek_help' para seekers.
        """
        collection_name = "helpers_disciplines" if type_help == "offer_help" else "seekers_disciplines"

        # Recupera o documento do usuário
        user_data = Db.get_document('users', user_id)
        if not user_data:
            raise ValueError("Usuário não encontrado")

        # Obtém a lista atual de IDs de disciplinas
        existing_discipline_ids = user_data.get(collection_name, [])

        # Remove as disciplinas especificadas
        updated_discipline_ids = [id for id in existing_discipline_ids if id not in discipline_ids]

        # Atualiza o documento do usuário com a nova lista
        updates = {collection_name: updated_discipline_ids}
        Db.update_document('users', user_id, updates)
