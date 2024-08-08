from typing import Optional

from firebase_admin import auth, firestore
from werkzeug.security import generate_password_hash

from models import User
from repositories.repository import CourseRepository, DisciplineRepository


class UserControl:
    def __init__(self, user):
        # if not isinstance(user, Admin):
        #     raise PermissionError("O usuário não possui privilégios de administrador.")
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

    def update_user_role(self, uid: str, new_role: str):
        try:
            # Atualiza o papel do usuário no Firestore
            self.db.collection('users').document(uid).update({
                'role': new_role
            })
            return True
        except Exception as e:
            print(f"Error updating user role: {e}")
            return False

    def delete_user(self, uid: str):
        try:
            # Deleta o usuário do Firebase Authentication
            auth.delete_user(uid)
            # Remove o usuário do Firestore
            self.db.collection('users').document(uid).delete()
            return True
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False
