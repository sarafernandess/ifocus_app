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

    def __repr__(self):
        return (f"User(name={self.name}, email={self.email}, role={self.role}, "
                f"phone={self.phone})")

    def to_dict(self):
        """
        Converte a instância do usuário em um dicionário.

        :return: Dicionário com os dados do usuário.
        """
        return {
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone
        }

    @classmethod
    def from_dict(cls, data: dict):
        """
        Cria uma instância do usuário a partir de um dicionário.

        :param data: Dicionário com os dados do usuário.
        :return: Instância do usuário.
        """
        return cls(
            name=data.get('name'),
            email=data.get('email'),
            role=data.get('role', 'student'),
            phone=data.get('phone')
        )

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
    id: Optional[str]  # Adiciona o campo UID opcional
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
        self.id = id
        self.name = name
        self.code = code
        self.semester = semester

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'semester': self.semester
        }

    @classmethod
    def from_dict(cls, data: dict):
        if not isinstance(data, dict):
            raise ValueError("Data must be a dictionary")
        return cls(
            id=data.get('id'),
            name=data.get('name'),
            code=data.get('code'),
            semester=data.get('semester')
        )
