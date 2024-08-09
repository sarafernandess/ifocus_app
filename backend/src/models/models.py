from typing import Optional, Dict, Any

from pydantic import BaseModel


class User:
    def __init__(self, name: str, email: str, role: str = "student", phone: Optional[str] = None):
        """
        Inicializa um novo usuário.

        :param name: Nome do usuário.
        :param email: Email do usuário.
        :param role: Papel do usuário (padrão é "student").
        :param phone: Telefone do usuário (opcional).
        """
        self.name = name
        self.email = email
        self.role = role
        self.phone = phone
        self.helper_disciplines = []  # Disciplinas onde o usuário oferece ajuda
        self.seeker_disciplines = []  # Disciplinas onde o usuário busca ajuda

    def add_helper_discipline(self, discipline_id: str):
        """
        Adiciona uma disciplina à lista de disciplinas onde o usuário oferece ajuda.

        :param discipline_id: ID da disciplina.
        """
        if discipline_id not in self.helper_disciplines:
            self.helper_disciplines.append(discipline_id)

    def add_seeker_discipline(self, discipline_id: str):
        """
        Adiciona uma disciplina à lista de disciplinas onde o usuário busca ajuda.

        :param discipline_id: ID da disciplina.
        """
        if discipline_id not in self.seeker_disciplines:
            self.seeker_disciplines.append(discipline_id)

    def to_dict(self):
        """
        Converte a instância do usuário em um dicionário.

        :return: Dicionário com os dados do usuário.
        """
        return {
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'helper_disciplines': self.helper_disciplines,
            'seeker_disciplines': self.seeker_disciplines
        }

    @classmethod
    def from_dict(cls, data: dict):
        """
        Cria uma instância do usuário a partir de um dicionário.

        :param data: Dicionário com os dados do usuário.
        :return: Instância do usuário.
        """
        user = cls(
            name=data.get('name'),
            email=data.get('email'),
            role=data.get('role', 'student'),
            phone=data.get('phone')
        )
        user.helper_disciplines = data.get('helper_disciplines', [])
        user.seeker_disciplines = data.get('seeker_disciplines', [])
        return user


class Admin(User):
    def __init__(self, name: str, email: str, phone: Optional[str] = None):
        """
        Inicializa um novo administrador.

        :param name: Nome do administrador.
        :param email: Email do administrador.
        :param phone: Telefone do administrador (opcional).
        """
        super().__init__(name, email, role="admin", phone=phone)

    def __repr__(self):
        return (f"Admin(name={self.name}, email={self.email}, phone={self.phone})")


class Course(BaseModel):
    id: Optional[str] = None  # ID pode ser None inicialmente
    name: str
    code: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Course':
        return Course(
            id=data.get("id"),
            name=data.get("name"),
            code=data.get("code")
        )

class CourseResponse(BaseModel):
    id: Optional[str]
    name: str
    code: str

    @classmethod
    def from_course(cls, course: Course) -> 'CourseResponse':
        """Cria uma instância de CourseResponse a partir de um objeto Course."""
        return cls(
            id=course.id,
            name=course.name,
            code=course.code
        )

class CourseCreate(BaseModel):
    name: str
    code: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Análise e Desenvolvimento de Sistemas",
                "code": "ADS"
            }
        }


class Discipline:
    def __init__(self, id: Optional[str], name: str, code: str, semester: int):
        """
        Inicializa uma nova disciplina.

        :param id: ID da disciplina (pode ser None inicialmente).
        :param name: Nome da disciplina.
        :param code: Código da disciplina.
        :param semester: Semestre da disciplina.
        """
        self.id = id
        self.name = name
        self.code = code
        self.semester = semester
        self.helpers = []  # IDs dos usuários que oferecem ajuda nesta disciplina
        self.seekers = []  # IDs dos usuários que buscam ajuda nesta disciplina

    def add_helper(self, user_id: str):
        """
        Adiciona um usuário à lista de helpers (usuários que oferecem ajuda).

        :param user_id: ID do usuário.
        """
        if user_id not in self.helpers:
            self.helpers.append(user_id)

    def add_seeker(self, user_id: str):
        """
        Adiciona um usuário à lista de seekers (usuários que buscam ajuda).

        :param user_id: ID do usuário.
        """
        if user_id not in self.seekers:
            self.seekers.append(user_id)

    def to_dict(self):
        """
        Converte a instância da disciplina em um dicionário.

        :return: Dicionário com os dados da disciplina.
        """
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'semester': self.semester,
            'helpers': self.helpers,
            'seekers': self.seekers
        }

    @classmethod
    def from_dict(cls, data: dict):
        """
        Cria uma instância da disciplina a partir de um dicionário.

        :param data: Dicionário com os dados da disciplina.
        :return: Instância da disciplina.
        """
        discipline = cls(
            id=data.get('id'),
            name=data.get('name'),
            code=data.get('code'),
            semester=data.get('semester')
        )
        discipline.helpers = data.get('helpers', [])
        discipline.seekers = data.get('seekers', [])
        return discipline
