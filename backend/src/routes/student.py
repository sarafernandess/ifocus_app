# # src/routes/student.py
# from fastapi import APIRouter, HTTPException, Depends
#
# from data.database import Db
# from models import User
#
# from fastapi.security import OAuth2PasswordBearer
#
# router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
#
# # Função para obter o usuário atual (mock)
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     # Implementação mock para obter o usuário pelo token
#     # Aqui, você deve implementar a lógica para obter um usuário com base no token
#     # No momento, usando o e-mail como token
#     return Db.get_user_by_email(token)
#
# @router.get("/courses")
# async def student_courses(user: User = Depends(get_current_user)):
#     """Lista todos os cursos em que o aluno está inscrito."""
#     if user.role != 'student':
#         raise HTTPException(status_code=403, detail="Access forbidden: Students only")
#     student = Db.get_student(user.id)
#     if student:
#         return {"courses": student.list_courses()}
#     raise HTTPException(status_code=404, detail="Student not found")
#
# @router.post("/courses/enroll")
# async def enroll_in_course(course: str, user: User = Depends(get_current_user)):
#     """Permite ao aluno inscrever-se em um curso."""
#     if user.role != 'student':
#         raise HTTPException(status_code=403, detail="Access forbidden: Students only")
#     student = Db.get_student(user.id)
#     if student:
#         student.enroll_in_course(course)
#         Db.add_student(student)  # Atualiza o aluno com o novo curso
#         return {"message": f"Enrolled in course {course}"}
#     raise HTTPException(status_code=404, detail="Student not found")
