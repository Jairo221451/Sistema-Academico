from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, time, datetime

# ========== ESTUDIANTES ==========
class EstudianteBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None

class EstudianteCreate(EstudianteBase):
    pass

class Estudiante(EstudianteBase):
    id_usuario: int
    
    class Config:
        from_attributes = True

# ========== DOCENTES ==========
class DocenteBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None

class DocenteCreate(DocenteBase):
    pass

class Docente(DocenteBase):
    id_usuario: int
    
    class Config:
        from_attributes = True

# ========== ADMINISTRADORES ==========
class AdministradorBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None

class AdministradorCreate(AdministradorBase):
    pass

class Administrador(AdministradorBase):
    id_usuario: int
    
    class Config:
        from_attributes = True

# ========== CICLOS ==========
class CicloBase(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date

class CicloCreate(CicloBase):
    pass

class Ciclo(CicloBase):
    id_ciclo: int
    
    class Config:
        from_attributes = True

# ========== CURSOS ==========
class CursoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    id_ciclo: int

class CursoCreate(CursoBase):
    pass

class Curso(CursoBase):
    id_curso: int
    
    class Config:
        from_attributes = True

# ========== HORARIOS ==========
class HorarioBase(BaseModel):
    id_curso: int
    dia_semana: str
    hora_inicio: time
    hora_fin: time
    aula: Optional[str] = None

class HorarioCreate(HorarioBase):
    pass

class Horario(HorarioBase):
    id_horario: int
    
    class Config:
        from_attributes = True

# ========== MATRÍCULAS ==========
class MatriculaBase(BaseModel):
    id_usuario: int
    id_ciclo: int

class MatriculaCreate(MatriculaBase):
    pass

class Matricula(MatriculaBase):
    id_matricula: int
    fecha_matricula: datetime
    
    class Config:
        from_attributes = True