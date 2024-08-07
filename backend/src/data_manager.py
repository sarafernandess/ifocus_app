import json
import os

from models import User, Student


class DataManager:
    FILE_PATH = 'data/database.py'

    @staticmethod
    def _load_data():
        """Carrega os dados do arquivo JSON, se existir."""
        if os.path.exists(DataManager.FILE_PATH):
            with open(DataManager.FILE_PATH, 'r') as file:
                return json.load(file)
        return {'users': {}, 'students': {}}

    @staticmethod
    def _save_data(data):
        """Salva os dados no arquivo JSON."""
        with open(DataManager.FILE_PATH, 'w') as file:
            json.dump(data, file, indent=4)

    @staticmethod
    def add_user(user):
        """Adiciona um usuário ao arquivo de dados."""
        data = DataManager._load_data()
        data['users'][user.id] = user.__dict__
        DataManager._save_data(data)

    @staticmethod
    def get_user(id):
        """Obtém um usuário pelo ID."""
        data = DataManager._load_data()
        user_data = data['users'].get(id)
        if user_data:
            return User(**user_data)
        return None

    @staticmethod
    def update_user(id, name=None, email=None, password=None):
        """Atualiza as informações de um usuário."""
        data = DataManager._load_data()
        user_data = data['users'].get(id)
        if user_data:
            if name:
                user_data['name'] = name
            if email:
                user_data['email'] = email
            if password:
                user_data['password'] = password
            data['users'][id] = user_data
            DataManager._save_data(data)

    @staticmethod
    def delete_user(id):
        """Remove um usuário pelo ID."""
        data = DataManager._load_data()
        if id in data['users']:
            del data['users'][id]
            DataManager._save_data(data)

    @staticmethod
    def add_student(student):
        """Adiciona um aluno ao arquivo de dados."""
        data = DataManager._load_data()
        data['students'][student.id] = student.__dict__
        DataManager._save_data(data)

    @staticmethod
    def get_student(id):
        """Obtém um aluno pelo ID."""
        data = DataManager._load_data()
        student_data = data['students'].get(id)
        if student_data:
            return Student(**student_data)
        return None

    @staticmethod
    def enroll_in_course(student_id, course):
        """Inscreve um aluno em um curso."""
        student = DataManager.get_student(student_id)
        if student:
            student.enroll_in_course(course)
            DataManager.add_student(student)

    @staticmethod
    def list_courses_of_student(student_id):
        """Lista os cursos de um aluno."""
        student = DataManager.get_student(student_id)
        if student:
            return student.list_courses()
        return []
