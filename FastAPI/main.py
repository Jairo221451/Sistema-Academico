from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Annotated, Optional
from . import models
from . import schemas
from .database import SessionLocal, engine
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import PyJWTError
from fastapi.responses import JSONResponse

# Configuración de seguridad
SECRET_KEY = "tu-clave-secreta-super-segura-aqui"  # Cambia esto en producción
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

app = FastAPI(
    title="Sistema Académico API - Sprint 2",
    description="API para gestión completa del sistema académico",
    version="2.0.0"
)

# ========== CONFIGURACIÓN CORS ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear todas las tablas
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# ========== FUNCIONES DE AUTENTICACIÓN ==========
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    
    user = db.query(models.Usuario).filter(models.Usuario.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# ========== ENDPOINTS DE PRUEBA ==========
@app.get("/")
async def root():
    return {"message": "Sistema Académico API Sprint 2 funcionando correctamente"}

@app.get("/api/")
async def api_root():
    return {"message": "API v2.0 - Sistema Académico Sprint 2"}

@app.get("/api/test-db")
async def test_database(db: db_dependency):
    try:
        result = db.execute("SELECT 1")
        return {"status": "success", "message": "Conexión a base de datos exitosa"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")

# ========== ENDPOINTS DE AUTENTICACIÓN ==========
@app.post("/api/auth/register/estudiante", response_model=schemas.Usuario)
async def registrar_estudiante(estudiante_data: schemas.EstudianteCreate, db: db_dependency):
    try:
        # Verificar si el username o email ya existen
        existing_user = db.query(models.Usuario).filter(
            (models.Usuario.username == estudiante_data.usuario.username) | 
            (models.Usuario.email == estudiante_data.usuario.email)
        ).first()
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Username o email ya registrado")
        
        # Crear usuario
        hashed_password = get_password_hash(estudiante_data.usuario.password)
        db_usuario = models.Usuario(
            username=estudiante_data.usuario.username,
            email=estudiante_data.usuario.email,
            password_hash=hashed_password,
            tipo_usuario="estudiante"
        )
        db.add(db_usuario)
        db.flush()  # Para obtener el ID del usuario
        
        # Crear estudiante
        db_estudiante = models.Estudiante(
            id_usuario=db_usuario.id_usuario,
            nombre=estudiante_data.nombre,
            apellido=estudiante_data.apellido,
            dni=estudiante_data.dni,
            telefono=estudiante_data.telefono,
            fecha_nacimiento=estudiante_data.fecha_nacimiento,
            direccion=estudiante_data.direccion,
            nombre_padre=estudiante_data.nombre_padre,
            telefono_padre=estudiante_data.telefono_padre,
            email_padre=estudiante_data.email_padre,
            nivel_educativo=estudiante_data.nivel_educativo
        )
        db.add(db_estudiante)
        db.commit()
        db.refresh(db_usuario)
        
        return db_usuario
        
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad en los datos")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@app.post("/api/auth/login")
async def login(login_data: schemas.UsuarioLogin, db: db_dependency):
    user = db.query(models.Usuario).filter(models.Usuario.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    if not user.activo:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Obtener datos específicos según el tipo de usuario
    estudiante = None
    docente = None
    administrador = None
    
    if user.tipo_usuario == "estudiante":
        estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_usuario == user.id_usuario).first()
    elif user.tipo_usuario == "docente":
        docente = db.query(models.Docente).filter(models.Docente.id_usuario == user.id_usuario).first()
    elif user.tipo_usuario == "administrador":
        administrador = db.query(models.Administrador).filter(models.Administrador.id_usuario == user.id_usuario).first()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": user,
        "estudiante": estudiante,
        "docente": docente,
        "administrador": administrador
    }

# ========== ENDPOINTS PARA ESTUDIANTES ==========
@app.get("/api/estudiantes", response_model=List[schemas.Estudiante])
async def listar_estudiantes(db: db_dependency, skip: int = 0, limit: int = 100):
    estudiantes = db.query(models.Estudiante).offset(skip).limit(limit).all()
    return estudiantes

@app.get("/api/estudiantes/{estudiante_id}", response_model=schemas.Estudiante)
async def obtener_estudiante(estudiante_id: int, db: db_dependency):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_usuario == estudiante_id).first()
    if estudiante is None:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante

# ========== ENDPOINTS PARA DOCENTES ==========
@app.get("/api/docentes", response_model=List[schemas.Docente])
async def listar_docentes(db: db_dependency, skip: int = 0, limit: int = 100):
    docentes = db.query(models.Docente).offset(skip).limit(limit).all()
    return docentes

# ========== ENDPOINTS PARA CICLOS ==========
@app.post("/api/ciclos", response_model=schemas.Ciclo)
async def crear_ciclo(ciclo: schemas.CicloCreate, db: db_dependency):
    db_ciclo = models.Ciclo(**ciclo.dict())
    db.add(db_ciclo)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo

@app.get("/api/ciclos", response_model=List[schemas.Ciclo])
async def listar_ciclos(db: db_dependency, skip: int = 0, limit: int = 100):
    ciclos = db.query(models.Ciclo).offset(skip).limit(limit).all()
    return ciclos

# ========== ENDPOINTS PARA CURSOS ==========
@app.post("/api/cursos", response_model=schemas.Curso)
async def crear_curso(curso: schemas.CursoCreate, db: db_dependency):
    # Verificar que el ciclo existe
    ciclo = db.query(models.Ciclo).filter(models.Ciclo.id_ciclo == curso.id_ciclo).first()
    if not ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    
    db_curso = models.Curso(**curso.dict())
    db.add(db_curso)
    db.commit()
    db.refresh(db_curso)
    return db_curso

@app.get("/api/cursos", response_model=List[schemas.Curso])
async def listar_cursos(db: db_dependency, skip: int = 0, limit: int = 100):
    cursos = db.query(models.Curso).offset(skip).limit(limit).all()
    return cursos

# ========== ENDPOINTS PARA MATRÍCULAS ==========
@app.post("/api/matriculas", response_model=schemas.Matricula)
async def crear_matricula(matricula: schemas.MatriculaCreate, db: db_dependency):
    # Verificar que el estudiante existe
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_usuario == matricula.id_usuario).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # Verificar que el ciclo existe
    ciclo = db.query(models.Ciclo).filter(models.Ciclo.id_ciclo == matricula.id_ciclo).first()
    if not ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    
    # Verificar que la modalidad existe
    modalidad = db.query(models.Modalidad).filter(models.Modalidad.id_modalidad == matricula.id_modalidad).first()
    if not modalidad:
        raise HTTPException(status_code=404, detail="Modalidad no encontrada")
    
    # Verificar que no esté ya matriculado en ese ciclo
    matricula_existente = db.query(models.Matricula).filter(
        models.Matricula.id_usuario == matricula.id_usuario,
        models.Matricula.id_ciclo == matricula.id_ciclo
    ).first()
    if matricula_existente:
        raise HTTPException(status_code=400, detail="Estudiante ya matriculado en este ciclo")
    
    db_matricula = models.Matricula(**matricula.dict())
    db.add(db_matricula)
    db.commit()
    db.refresh(db_matricula)
    return db_matricula

@app.get("/api/matriculas", response_model=List[schemas.Matricula])
async def listar_matriculas(db: db_dependency, skip: int = 0, limit: int = 100):
    matriculas = db.query(models.Matricula).offset(skip).limit(limit).all()
    return matriculas

# ========== ENDPOINTS PARA ESTADÍSTICAS ==========
@app.get("/api/estadisticas")
async def obtener_estadisticas(db: db_dependency):
    total_estudiantes = db.query(models.Estudiante).count()
    total_docentes = db.query(models.Docente).count()
    total_administradores = db.query(models.Administrador).count()
    total_ciclos = db.query(models.Ciclo).count()
    total_cursos = db.query(models.Curso).count()
    total_matriculas = db.query(models.Matricula).count()
    total_pagos = db.query(models.Pago).count()
    
    return {
        "total_estudiantes": total_estudiantes,
        "total_docentes": total_docentes,
        "total_administradores": total_administradores,
        "total_ciclos": total_ciclos,
        "total_cursos": total_cursos,
        "total_matriculas": total_matriculas,
        "total_pagos": total_pagos
    }

# ========== MANEJO DE ERRORES ==========
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"},
    )

# Endpoint para verificar token
@app.get("/api/auth/verify")
async def verify_token(current_user: schemas.Usuario = Depends(get_current_user)):
    return {"message": "Token válido", "user": current_user}