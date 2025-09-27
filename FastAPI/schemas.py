from pydantic import BaseModel, EmailStr, validator
from datetime import date, datetime, time
from typing import Optional, List
from decimal import Decimal

# ========== ESQUEMAS PARA AUTENTICACIÓN ==========
class UsuarioBase(BaseModel):
    username: str
    email: EmailStr
    tipo_usuario: str  # estudiante, docente, administrador

    @validator('tipo_usuario')
    def validate_tipo_usuario(cls, v):
        tipos_validos = ['estudiante', 'docente', 'administrador']
        if v not in tipos_validos:
            raise ValueError('Tipo de usuario inválido')
        return v

class UsuarioCreate(UsuarioBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return v

class UsuarioLogin(BaseModel):
    username: str
    password: str

class Usuario(UsuarioBase):
    id_usuario: int
    activo: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA ESTUDIANTES ==========
class EstudianteBase(BaseModel):
    nombre: str
    apellido: str
    dni: Optional[str] = None
    telefono: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    direccion: Optional[str] = None
    nombre_padre: Optional[str] = None
    telefono_padre: Optional[str] = None
    email_padre: Optional[EmailStr] = None
    nivel_educativo: Optional[str] = None

    @validator('nombre', 'apellido')
    def validate_nombres(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nombre y apellido deben tener al menos 2 caracteres')
        return v.strip()

    @validator('dni')
    def validate_dni(cls, v):
        if v and (len(v) != 8 or not v.isdigit()):
            raise ValueError('DNI debe tener 8 dígitos')
        return v

class EstudianteCreate(EstudianteBase):
    usuario: UsuarioCreate

class Estudiante(EstudianteBase):
    id_usuario: int
    created_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA DOCENTES ==========
class DocenteBase(BaseModel):
    nombre: str
    apellido: str
    dni: Optional[str] = None
    telefono: Optional[str] = None
    especialidad: Optional[str] = None

    @validator('nombre', 'apellido')
    def validate_nombres(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nombre y apellido deben tener al menos 2 caracteres')
        return v.strip()

class DocenteCreate(DocenteBase):
    usuario: UsuarioCreate

class Docente(DocenteBase):
    id_usuario: int
    created_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA ADMINISTRADORES ==========
class AdministradorBase(BaseModel):
    nombre: str
    apellido: str
    dni: Optional[str] = None
    telefono: Optional[str] = None
    rol: Optional[str] = 'admin'
    permisos: Optional[List[str]] = None

class AdministradorCreate(AdministradorBase):
    usuario: UsuarioCreate

class Administrador(AdministradorBase):
    id_usuario: int
    created_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA CICLOS ==========
class CicloBase(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date
    fecha_inicio_matricula: date
    fecha_fin_matricula: date
    activo: bool = True

    @validator('fecha_fin')
    def validate_fecha_fin(cls, v, values):
        if 'fecha_inicio' in values and v <= values['fecha_inicio']:
            raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return v

    @validator('fecha_fin_matricula')
    def validate_fecha_fin_matricula(cls, v, values):
        if 'fecha_inicio_matricula' in values and v <= values['fecha_inicio_matricula']:
            raise ValueError('La fecha de fin de matrícula debe ser posterior a la fecha de inicio')
        return v

class CicloCreate(CicloBase):
    pass

class Ciclo(CicloBase):
    id_ciclo: int
    created_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA MODALIDADES ==========
class ModalidadBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    activo: bool = True

class ModalidadCreate(ModalidadBase):
    pass

class Modalidad(ModalidadBase):
    id_modalidad: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA CURSOS ==========
class CursoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    id_ciclo: int
    nivel_educativo: Optional[str] = None
    activo: bool = True

class CursoCreate(CursoBase):
    pass

class Curso(CursoBase):
    id_curso: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA TEMAS ==========
class TemaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    duracion_estimada_horas: Optional[int] = None
    orden: Optional[int] = None
    activo: bool = True

class TemaCreate(TemaBase):
    id_curso: int

class Tema(TemaBase):
    id_tema: int
    id_curso: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA GRUPOS ==========
class GrupoBase(BaseModel):
    codigo: str
    id_curso: int
    id_docente: Optional[int] = None
    capacidad_maxima: int = 20
    activo: bool = True

class GrupoCreate(GrupoBase):
    pass

class Grupo(GrupoBase):
    id_grupo: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA HORARIOS ==========
class HorarioBase(BaseModel):
    id_grupo: int
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
    id_modalidad: int
    estado: str = 'activa'

class MatriculaCreate(MatriculaBase):
    pass

class Matricula(MatriculaBase):
    id_matricula: int
    fecha_matricula: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA MATRÍCULA GRUPOS ==========
class MatriculaGrupoBase(BaseModel):
    id_matricula: int
    id_grupo: int

class MatriculaGrupoCreate(MatriculaGrupoBase):
    pass

class MatriculaGrupo(MatriculaGrupoBase):
    id: int
    fecha_inscripcion: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA CONCEPTOS DE PAGO ==========
class ConceptoPagoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    monto_base: Optional[Decimal] = None
    activo: bool = True

class ConceptoPagoCreate(ConceptoPagoBase):
    pass

class ConceptoPago(ConceptoPagoBase):
    id_concepto: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA PAGOS ==========
class PagoBase(BaseModel):
    id_matricula: int
    id_concepto: int
    mes_pagado: Optional[int] = None
    año_pagado: Optional[int] = None
    monto: Decimal
    metodo_pago: Optional[str] = None
    observaciones: Optional[str] = None
    estado: str = 'confirmado'

class PagoCreate(PagoBase):
    pass

class Pago(PagoBase):
    id_pago: int
    fecha_pago: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA ASISTENCIAS ==========
class AsistenciaDocenteBase(BaseModel):
    id_docente: int
    id_grupo: int
    fecha: date
    hora_entrada: Optional[str] = None
    hora_salida: Optional[str] = None
    id_tema_trabajado: Optional[int] = None
    observaciones: Optional[str] = None
    tipo_registro: str = 'manual'

class AsistenciaDocenteCreate(AsistenciaDocenteBase):
    pass

class AsistenciaDocente(AsistenciaDocenteBase):
    id_asistencia: int
    created_at: datetime

    class Config:
        from_attributes = True

class AsistenciaEstudianteBase(BaseModel):
    id_usuario: int
    id_grupo: int
    fecha: date
    presente: bool = True
    hora_entrada: Optional[str] = None
    hora_salida: Optional[str] = None
    observaciones: Optional[str] = None

class AsistenciaEstudianteCreate(AsistenciaEstudianteBase):
    pass

class AsistenciaEstudiante(AsistenciaEstudianteBase):
    id_asistencia: int
    created_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA INCIDENCIAS ==========
class TipoIncidenciaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    nivel_gravedad: int = 1

class TipoIncidenciaCreate(TipoIncidenciaBase):
    pass

class TipoIncidencia(TipoIncidenciaBase):
    id_tipo: int

    class Config:
        from_attributes = True

class IncidenciaBase(BaseModel):
    id_usuario: int
    id_tipo: int
    id_grupo: Optional[int] = None
    descripcion: str
    accion_tomada: Optional[str] = None
    notificado_padre: bool = False
    fecha_notificacion: Optional[datetime] = None
    created_by: Optional[int] = None

class IncidenciaCreate(IncidenciaBase):
    pass

class Incidencia(IncidenciaBase):
    id_incidencia: int
    fecha_incidencia: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA NOTIFICACIONES ==========
class NotificacionBase(BaseModel):
    id_usuario: Optional[int] = None
    tipo: str
    titulo: str
    mensaje: str
    destinatario: str
    telefono_destinatario: Optional[str] = None
    email_destinatario: Optional[EmailStr] = None
    metodo_envio: Optional[str] = None

class NotificacionCreate(NotificacionBase):
    pass

class Notificacion(NotificacionBase):
    id_notificacion: int
    enviado: bool = False
    fecha_envio: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA PROGRESO TEMAS ==========
class ProgresoTemaBase(BaseModel):
    id_grupo: int
    id_tema: int
    fecha_planificada: Optional[date] = None
    fecha_ejecutada: Optional[date] = None
    completado: bool = False
    observaciones: Optional[str] = None

class ProgresoTemaCreate(ProgresoTemaBase):
    pass

class ProgresoTema(ProgresoTemaBase):
    id_progreso: int

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA SESIONES ==========
class SesionBase(BaseModel):
    id_usuario: int
    token_sesion: str
    fecha_expiracion: datetime

class SesionCreate(SesionBase):
    pass

class Sesion(SesionBase):
    id_sesion: int
    fecha_inicio: datetime
    activa: bool = True

    class Config:
        from_attributes = True

# ========== ESQUEMAS PARA RESPUESTAS DE AUTENTICACIÓN ==========
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    usuario: Usuario
    estudiante: Optional[Estudiante] = None
    docente: Optional[Docente] = None
    administrador: Optional[Administrador] = None

# ========== ESQUEMAS PARA ESTADÍSTICAS ==========
class Estadisticas(BaseModel):
    total_estudiantes: int
    total_docentes: int
    total_administradores: int
    total_ciclos: int
    total_cursos: int
    total_matriculas: int
    total_pagos: int