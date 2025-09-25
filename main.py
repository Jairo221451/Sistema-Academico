from fastapi import FastAPI, HTTPException, Depends
from typing import List, Annotated
import models
import schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session

app = FastAPI(
    title="Sistema Académico API",
    description="API para gestión de estudiantes, docentes, cursos y matrículas",
    version="1.0.0"
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

# ========== ENDPOINT DE PRUEBA ==========
@app.get("/")
async def root():
    return {"message": "Sistema Académico API funcionando correctamente"}

@app.get("/test-db")
async def test_database(db: db_dependency):
    try:
        # Prueba la conexión
        result = db.execute("SELECT 1")
        return {"status": "success", "message": "Conexión a base de datos exitosa"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")

# ========== ENDPOINTS DE ESTUDIANTES ==========
@app.post("/estudiantes/", response_model=schemas.Estudiante)
async def crear_estudiante(estudiante: schemas.EstudianteCreate, db: db_dependency):
    # Verificar si el email ya existe
    db_estudiante = db.query(models.Estudiante).filter(models.Estudiante.email == estudiante.email).first()
    if db_estudiante:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    db_estudiante = models.Estudiante(**estudiante.dict())
    db.add(db_estudiante)
    db.commit()
    db.refresh(db_estudiante)
    return db_estudiante

@app.get("/estudiantes/", response_model=List[schemas.Estudiante])
async def listar_estudiantes(db: db_dependency):
    return db.query(models.Estudiante).all()

@app.get("/estudiantes/{estudiante_id}", response_model=schemas.Estudiante)
async def obtener_estudiante(estudiante_id: int, db: db_dependency):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_usuario == estudiante_id).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante

# ========== ENDPOINTS DE DOCENTES ==========
@app.post("/docentes/", response_model=schemas.Docente)
async def crear_docente(docente: schemas.DocenteCreate, db: db_dependency):
    # Verificar si el email ya existe
    db_docente = db.query(models.Docente).filter(models.Docente.email == docente.email).first()
    if db_docente:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    db_docente = models.Docente(**docente.dict())
    db.add(db_docente)
    db.commit()
    db.refresh(db_docente)
    return db_docente

@app.get("/docentes/", response_model=List[schemas.Docente])
async def listar_docentes(db: db_dependency):
    return db.query(models.Docente).all()

# ========== ENDPOINTS DE CICLOS ==========
@app.post("/ciclos/", response_model=schemas.Ciclo)
async def crear_ciclo(ciclo: schemas.CicloCreate, db: db_dependency):
    db_ciclo = models.Ciclo(**ciclo.dict())
    db.add(db_ciclo)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo

@app.get("/ciclos/", response_model=List[schemas.Ciclo])
async def listar_ciclos(db: db_dependency):
    return db.query(models.Ciclo).all()

@app.get("/ciclos/{ciclo_id}", response_model=schemas.Ciclo)
async def obtener_ciclo(ciclo_id: int, db: db_dependency):
    ciclo = db.query(models.Ciclo).filter(models.Ciclo.id_ciclo == ciclo_id).first()
    if not ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    return ciclo

# ========== ENDPOINTS DE CURSOS ==========
@app.post("/cursos/", response_model=schemas.Curso)
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

@app.get("/cursos/", response_model=List[schemas.Curso])
async def listar_cursos(db: db_dependency):
    return db.query(models.Curso).all()

@app.get("/ciclos/{ciclo_id}/cursos/", response_model=List[schemas.Curso])
async def listar_cursos_por_ciclo(ciclo_id: int, db: db_dependency):
    return db.query(models.Curso).filter(models.Curso.id_ciclo == ciclo_id).all()

# ========== ENDPOINTS DE HORARIOS ==========
@app.post("/horarios/", response_model=schemas.Horario)
async def crear_horario(horario: schemas.HorarioCreate, db: db_dependency):
    # Verificar que el curso existe
    curso = db.query(models.Curso).filter(models.Curso.id_curso == horario.id_curso).first()
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    
    db_horario = models.Horario(**horario.dict())
    db.add(db_horario)
    db.commit()
    db.refresh(db_horario)
    return db_horario

@app.get("/horarios/", response_model=List[schemas.Horario])
async def listar_horarios(db: db_dependency):
    return db.query(models.Horario).all()

@app.get("/cursos/{curso_id}/horarios/", response_model=List[schemas.Horario])
async def listar_horarios_por_curso(curso_id: int, db: db_dependency):
    return db.query(models.Horario).filter(models.Horario.id_curso == curso_id).all()

# ========== ENDPOINTS DE MATRÍCULAS ==========
@app.post("/matriculas/", response_model=schemas.Matricula)
async def crear_matricula(matricula: schemas.MatriculaCreate, db: db_dependency):
    # Verificar que el estudiante existe
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.id_usuario == matricula.id_usuario).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # Verificar que el ciclo existe
    ciclo = db.query(models.Ciclo).filter(models.Ciclo.id_ciclo == matricula.id_ciclo).first()
    if not ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    
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

@app.get("/matriculas/", response_model=List[schemas.Matricula])
async def listar_matriculas(db: db_dependency):
    return db.query(models.Matricula).all()

@app.get("/estudiantes/{estudiante_id}/matriculas/", response_model=List[schemas.Matricula])
async def listar_matriculas_por_estudiante(estudiante_id: int, db: db_dependency):
    return db.query(models.Matricula).filter(models.Matricula.id_usuario == estudiante_id).all()

# ========== ESTADÍSTICAS ==========
@app.get("/estadisticas/")
async def obtener_estadisticas(db: db_dependency):
    total_estudiantes = db.query(models.Estudiante).count()
    total_docentes = db.query(models.Docente).count()
    total_cursos = db.query(models.Curso).count()
    total_matriculas = db.query(models.Matricula).count()
    
    return {
        "total_estudiantes": total_estudiantes,
        "total_docentes": total_docentes,
        "total_cursos": total_cursos,
        "total_matriculas": total_matriculas
    }