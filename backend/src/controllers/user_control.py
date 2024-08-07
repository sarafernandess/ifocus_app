from typing import Optional

from firebase_admin import auth, firestore
from werkzeug.security import generate_password_hash

from models import User


class UserControl:

    def __init__(self):
        self.db = firestore.client()  # Conexão com Firestore

    def create_user(self, name: str, email: str, password: str, role: str = "student", phone: Optional[str] = None):
        """
        Cria um novo usuário e o salva no Firebase e Firestore.

        :param name: Nome do usuário.
        :param email: Email do usuário.
        :param password: Senha do usuário (deve ser hasheada antes de armazenar).
        :param role: Papel do usuário (padrão é "student").
        :param phone: Telefone do usuário (opcional).
        :return: ID do usuário criado ou None em caso de erro.
        """
        hashed_password = generate_password_hash(password)
        user = User(name, email, hashed_password, role, phone)
        return self._save_user_to_firebase(user)

    def _save_user_to_firebase(self, user: User):
        try:
            # Cria o usuário no Firebase Authentication
            user_record = auth.create_user(
                email=user.email,
                password=user.password,
                display_name=user.name,
            )

            # Adiciona uma entrada no Firestore
            self.db.collection('users').document(user_record.uid).set({
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'phone': user.phone
            })

            return user_record.uid  # Retorna o ID do usuário criado

        except Exception as e:
            print(f"Error creating user: {e}")
            return None

    @staticmethod
    def get_user(self, uid: str):
        try:
            user_record = auth.get_user(uid)
            user_data = self.db.collection('users').document(uid).get()

            if user_data.exists:
                return user_data.to_dict()  # Retorna os dados do usuário como um dicionário

            return None
        except Exception as e:
            print(f"Error fetching user: {e}")
            return None

    def get_all_users(self):
        try:
            users_ref = self.db.collection('users')
            docs = users_ref.stream()  # Obtém todos os documentos na coleção

            all_users = []
            for doc in docs:
                user_data = doc.to_dict()  # Converte o documento em um dicionário
                all_users.append(user_data)  # Adiciona o dicionário à lista de todos os usuários
            print(all_users)
            return all_users  # Retorna a lista de todos os usuários
        except Exception as e:
            print(f"Error fetching users: {e}")
            return []

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
