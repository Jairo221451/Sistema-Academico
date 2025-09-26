from pydantic import BaseModel, EmailStr, validator
from datetime import date, datetime
from typing import Optional, List

# ========== ESQUEMAS PARA ESTUDIANTES ==========
class EstudianteBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None

    @validator('nombre', 'apellido')
    def validate_nombres(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nombre y apellido deben tener al menos 2 caracteres')
        return v.strip()

    @validator('telefono')
    def validate_telefono(cls, v):
        if v and (len(v) < 9 or not v.isdigit()):
            raise ValueError('Teléfono debe tener al menos 9 dígitos')
        return v

class EstudianteCreate(EstudianteBase):
    pass

class Estudiante(EstudianteBase):
    id_usuario: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA DOCENTES ==========
class DocenteBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None

    @validator('nombre', 'apellido')
    def validate_nombres(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nombre y apellido deben tener al menos 2 caracteres')
        return v.strip()

    @validator('telefono')
    def validate_telefono(cls, v):
        if v and (len(v) < 9 or not v.isdigit()):
            raise ValueError('Teléfono debe tener al menos 9 dígitos')
        return v

class DocenteCreate(DocenteBase):
    pass

class Docente(DocenteBase):
    id_usuario: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA ADMINISTRADORES ==========
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

# ========== ESQUEMAS PARA CICLOS ==========
class CicloBase(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date

    @validator('fecha_fin')
    def validate_fecha_fin(cls, v, values):
        if 'fecha_inicio' in values and v <= values['fecha_inicio']:
            raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v

class CicloCreate(CicloBase):
    pass

class Ciclo(CicloBase):
    id_ciclo: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA CURSOS ==========
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

# ========== ESQUEMAS PARA HORARIOS ==========
class HorarioBase(BaseModel):
    id_curso: int
    dia_semana: str
    hora_inicio: str  # Formato "HH:MM"
    hora_fin: str     # Formato "HH:MM"
    aula: Optional[str] = None

    @validator('dia_semana')
    def validate_dia_semana(cls, v):
        dias_validos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        if v not in dias_validos:
            raise ValueError('Día de semana inválido')
        return v

class HorarioCreate(HorarioBase):
    pass

class Horario(HorarioBase):
    id_horario: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA MATRÍCULAS ==========
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