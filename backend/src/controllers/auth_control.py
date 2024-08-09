import firebase_admin
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth

from data.database import Db
from models import User, Admin

# Inicializar o Firebase Admin
# Esta verificação garante que o Firebase Admin seja inicializado apenas uma vez.
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# Configuração do OAuth2
# OAuth2PasswordBearer é usado para gerenciar a autenticação baseada em tokens.
# Define o esquema de segurança para a API, especificando o URL para obter o token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthControl:
    """
    Controlador de Autenticação.
    Gerencia a autenticação de usuários e a autorização de administradores.
    """

    @staticmethod
    def get_current_user(token: str) -> User:
        """
        Obtém o usuário atual a partir do token JWT fornecido.

        :param token: Token JWT fornecido pelo cliente para autenticação.
        :return: Instância da classe User com as informações do usuário.
        :raises HTTPException: Se o token for inválido ou expirado, ou se o usuário não for encontrado.
        """
        try:
            # Decodifica o token JWT para obter o UID do usuário
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']

            # Obtém o cliente do banco de dados e recupera o documento do usuário
            db = Db.get_client()
            user_doc = db.collection('users').document(uid).get()

            # Se o documento do usuário não existir, levanta uma exceção
            if not user_doc.exists:
                raise HTTPException(status_code=404, detail="User not found")

            # Converte os dados do documento para um dicionário e cria uma instância de User
            user_info = user_doc.to_dict()
            return User.from_dict({
                'name': user_info.get('name', ''),
                'email': user_info.get('email', ''),
                'role': user_info.get('role', 'student'),
                'phone': user_info.get('phone', '')
            })
        except Exception as e:
            # Levanta uma exceção se o token for inválido ou expirado
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    @classmethod
    def is_admin(cls, token: str = Depends(oauth2_scheme)) -> Admin:
        """
        Verifica se o usuário autenticado é um administrador.

        :param token: Token JWT fornecido pelo cliente para autenticação.
                      O token é extraído usando OAuth2PasswordBearer.
        :return: Instância da classe Admin com as informações do usuário, se for um administrador.
        :raises HTTPException: Se o usuário não for um administrador ou se o token for inválido.
        """
        # Obtém o usuário atual a partir do token
        user = cls.get_current_user(token)

        # Verifica se o usuário tem o papel de administrador
        if user.role != 'admin':
            raise HTTPException(status_code=403, detail="Insufficient permissions")

        # Cria e retorna uma instância de Admin com as informações do usuário
        return Admin(name=user.name, email=user.email, phone=user.phone)
