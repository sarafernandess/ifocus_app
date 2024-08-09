from typing import List

from firebase_admin import auth, firestore
from repositories.repository import CourseRepository, DisciplineRepository, UserRepository


class UserControl:
    """
    Controlador de Usuários.
    Gerencia as interações entre usuários, cursos e disciplinas usando os repositórios.
    """

    def __init__(self, user):
        """
        Inicializa o controlador de usuários com um usuário.
        Inicializa o controlador de admin com um usuário.
        :param user: Instância do usuário que está controlando.
        """
        self.user = user

    def get_course(self, course_id):
        """Obtém um curso pelo seu ID."""
        data = CourseRepository.get(course_id)
        return data, course_id

    def get_all_courses(self):
        """Obtém todos os cursos disponíveis."""
        courses = CourseRepository.get_all()
        print("Courses from repository:", courses)  # Adicione este print para depuração
        return courses

    def get_discipline(self, course_id, discipline_id):
        """Obtém uma disciplina pelo seu ID dentro do curso especificado."""
        return DisciplineRepository.get(course_id, discipline_id)

    def get_all_disciplines(self, course_id):
        """Obtém todas as disciplinas de um curso especificado."""
        return DisciplineRepository.get_all_disciplines_in_course(course_id)

    def get_saved_disciplines(self, user_id: str, type_help: str):
        """
        Obtém todas as disciplinas salvas por um usuário na coleção 'seekers_disciplines' ou 'helpers_disciplines'.

        :param user_id: ID do usuário.
        :param type_help: Tipo de ajuda, 'offer_help' para helpers e 'seek_help' para seekers.
        :return: Lista de IDs das disciplinas salvas.
        """
        collection_name = "helpers_disciplines" if type_help == "offer_help" else "seekers_disciplines"
        user_data = UserRepository.get(user_id)
        discipline_ids = user_data.get(collection_name, [])
        return discipline_ids

    def get_disciplines_details(self, course_id: str, discipline_ids: List[str]):
        """
        Obtém os detalhes das disciplinas com base na lista de IDs fornecida.

        :param course_id: ID do curso.
        :param discipline_ids: Lista de IDs das disciplinas.
        :return: Lista de detalhes das disciplinas.
        """
        disciplines = []
        for discipline_id in discipline_ids:
            discipline = DisciplineRepository.get(discipline_id, course_id)
            if discipline:
                disciplines.append(discipline)
        return disciplines

    def assign_user_to_disciplines(self, user_id: str, course_id: str, discipline_ids: List[str], type_help: str):
        """
        Adiciona o usuário a várias disciplinas e as disciplinas ao usuário.
        """
        if not discipline_ids:
            raise ValueError("A lista de IDs das disciplinas não pode estar vazia.")

        # Adicionar o usuário a cada disciplina (helpers ou seekers)
        DisciplineRepository.add_user_to_disciplines(user_id, course_id, discipline_ids, type_help)

        # Adicionar cada disciplina ao usuário
        UserRepository.add_discipline_to_user(user_id, discipline_ids, type_help)

    def update_user_disciplines(self, user_id: str, course_id: str, new_discipline_ids: List[str], type_help: str):
        """
        Atualiza as disciplinas de um usuário, removendo todas as disciplinas antigas e adicionando as novas.
        """
        # Obter as disciplinas atuais do usuário
        user_data = UserRepository.get(user_id)
        collection_name = "helpers_disciplines" if type_help == "offer_help" else "seekers_disciplines"
        current_discipline_ids = user_data.get(collection_name, [])

        # Remover o usuário de todas as disciplinas atuais
        for discipline_id in current_discipline_ids:
            DisciplineRepository.remove_user_from_discipline(user_id, discipline_id, type_help, course_id)

        # Atualizar a lista de disciplinas do usuário
        UserRepository.update_user_disciplines(user_id, new_discipline_ids, type_help)

        # Adicionar o usuário às novas disciplinas
        DisciplineRepository.add_user_to_disciplines(user_id, course_id, new_discipline_ids, type_help)


    def remove_user_from_disciplines(self, user_id: str, course_id: str, discipline_ids: List[str], type_help: str):
        """
        Remove um usuário de várias disciplinas e remove as disciplinas da lista do usuário.

        :param user_id: ID do usuário a ser removido.
        :param course_id: ID do curso ao qual as disciplinas pertencem.
        :param discipline_ids: Lista de IDs das disciplinas das quais o usuário será removido.
        :param type_help: Tipo de ajuda, 'offer_help' para helpers e 'seek_help' para seekers.
        """
        collection_name = "helpers" if type_help == "offer_help" else "seekers"
        for discipline_id in discipline_ids:
            DisciplineRepository.remove_user_from_discipline(user_id, discipline_id, type_help, course_id)
        # Remove as disciplinas da lista do usuário
        UserRepository.remove_disciplines_from_user(user_id, discipline_ids, type_help)