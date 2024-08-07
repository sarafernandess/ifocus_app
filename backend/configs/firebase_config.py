import firebase_admin
from firebase_admin import credentials


def initialize_firebase():
    if not firebase_admin._apps:
    # Substitua pelo caminho para o seu arquivo de chave JSON do Firebase
        cred = credentials.Certificate("/Users/danielm/Documents/ifocus/ifocus_app/backend/serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
