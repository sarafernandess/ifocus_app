from models import Course, Discipline
from repositories.repository import CourseRepository, DisciplineRepository

class AdminControl:
    def __init__(self, user):
        # if not isinstance(user, Admin):
        #     raise PermissionError("O usuário não possui privilégios de administrador.")
        self.user = user

    def create_course(self, id: None, name, code):
        """Cria um novo curso com o nome e código fornecidos."""
        course = Course(id=id, name=name, code=code)  # Define uid como None na criação
        # Cria o curso e obtém o ID gerado
        created_course_id = CourseRepository.create(course)
        # Retorna o ID do curso criado
        return created_course_id

    def get_course(self, course_id):
        """Obtém um curso pelo seu ID."""
        data = CourseRepository.get(course_id)
        return data, course_id

    def get_all_courses(self):
        """Obtém todos os cursos disponíveis."""
        courses = CourseRepository.get_all()
        print("Courses from repository:", courses)  # Adicione este print para depuração
        return courses

    def update_course(self, course_id, name=None, code=None):
        """Atualiza um curso existente com os novos valores fornecidos."""
        updates = {}
        if name:
            updates['name'] = name
        if code:
            updates['code'] = code
        CourseRepository.update(course_id, updates)

    def delete_course(self, course_id=None):
        """Deleta um curso pelo seu ID."""
        CourseRepository.delete(course_id)

    def create_discipline(self, course_id, id: None, name, code, semester):
        """Cria uma nova disciplina dentro do curso especificado."""
        discipline = Discipline(id=id, name=name, code=code, semester=semester)
        return DisciplineRepository.create(discipline, course_id=course_id)

    def get_discipline(self, course_id, discipline_id):
        """Obtém uma disciplina pelo seu ID dentro do curso especificado."""
        return DisciplineRepository.get(course_id, discipline_id)

    def update_discipline(self, course_id, discipline_id, name=None, code=None, semester=None):
        """Atualiza uma disciplina existente com os novos valores fornecidos."""
        updates = {}
        if name:
            updates['name'] = name
        if code:
            updates['code'] = code
        if semester:
            updates['semester'] = semester
        DisciplineRepository.update(course_id, discipline_id, updates)

    def delete_discipline(self, course_id, discipline_id):
        """Deleta uma disciplina pelo seu ID dentro do curso especificado."""
        DisciplineRepository.delete(course_id, discipline_id)

    def get_all_disciplines(self, course_id):
        """Obtém todas as disciplinas de um curso especificado."""
        return DisciplineRepository.get_all_disciplines_in_course(course_id)

    def delete_all(self):
        return CourseRepository.delete_all()
