import firebase_admin
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth

from data.database import Db
from models import User, Admin

# Inicializar o Firebase Admin
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# Configuração do OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class AuthControl:
    def get_current_user(self, token: str) -> User:
        try:
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            db = Db.get_client()
            user_doc = db.collection('users').document(uid).get()
            if not user_doc.exists:
                raise HTTPException(status_code=404, detail="User not found")

            user_info = user_doc.to_dict()
            return User.from_dict({
                'name': user_info.get('name', ''),
                'email': user_info.get('email', ''),
                'role': user_info.get('role', 'student'),
                'phone': user_info.get('phone', '')
            })
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    def is_admin(self, token: str = Depends(oauth2_scheme)) -> Admin:
        user = self.get_current_user(token)
        if user.role != 'admin':
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return Admin(name=user.name, email=user.email, phone=user.phone)
