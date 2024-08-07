# src/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from configs.firebase_config import initialize_firebase

# Inicializar Firebase
initialize_firebase()
# from routes.user_routes import router as user_router
from routes.admin_routes import router as admin_router
# Importa as novas rotas

app = FastAPI()


# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens. Alterar para uma lista específica em produção
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Incluir rotas
app.include_router(admin_router, prefix="/admin")


@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="192.168.1.2", port=8000, reload=True)


