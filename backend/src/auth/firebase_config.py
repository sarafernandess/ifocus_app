import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("/Users/danielm/Documents/ifocus/my-app-ifocus/backend/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
