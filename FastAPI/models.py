from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Time, DateTime, Text, Numeric, ARRAY
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(String(20), nullable=False)  # estudiante, docente, administrador
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

class Estudiante(Base):
    __tablename__ = "estudiantes"

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), primary_key=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dni = Column(String(8), unique=True)
    telefono = Column(String(20))
    fecha_nacimiento = Column(Date)
    direccion = Column(Text)
    nombre_padre = Column(String(100))
    telefono_padre = Column(String(20))
    email_padre = Column(String(150))
    nivel_educativo = Column(String(50))
    created_at = Column(DateTime, default=datetime.now)
    
    # Relaciones
    usuario = relationship("Usuario")
    matriculas = relationship("Matricula", back_populates="estudiante")
    asistencias = relationship("AsistenciaEstudiante", back_populates="estudiante")
    incidencias = relationship("Incidencia", back_populates="estudiante")

class Docente(Base):
    __tablename__ = "docentes"

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), primary_key=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dni = Column(String(8), unique=True)
    telefono = Column(String(20))
    especialidad = Column(String(100))
    created_at = Column(DateTime, default=datetime.now)
    
    # Relaciones
    usuario = relationship("Usuario")
    grupos = relationship("Grupo", back_populates="docente")
    asistencias = relationship("AsistenciaDocente", back_populates="docente")

class Administrador(Base):
    __tablename__ = "administradores"

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), primary_key=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dni = Column(String(8), unique=True)
    telefono = Column(String(20))
    rol = Column(String(50), default='admin')
    permisos = Column(ARRAY(Text))
    created_at = Column(DateTime, default=datetime.now)
    
    # Relación
    usuario = relationship("Usuario")

class Sesion(Base):
    __tablename__ = "sesiones"

    id_sesion = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    token_sesion = Column(String(255), unique=True, nullable=False)
    fecha_inicio = Column(DateTime, default=datetime.now)
    fecha_expiracion = Column(DateTime, nullable=False)
    activa = Column(Boolean, default=True)
    
    # Relación
    usuario = relationship("Usuario")

class Ciclo(Base):
    __tablename__ = "ciclos"

    id_ciclo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    fecha_inicio_matricula = Column(Date, nullable=False)
    fecha_fin_matricula = Column(Date, nullable=False)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relaciones
    cursos = relationship("Curso", back_populates="ciclo")
    matriculas = relationship("Matricula", back_populates="ciclo")

class Modalidad(Base):
    __tablename__ = "modalidades"

    id_modalidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    descripcion = Column(Text)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    matriculas = relationship("Matricula", back_populates="modalidad")

class Curso(Base):
    __tablename__ = "cursos"

    id_curso = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text)
    id_ciclo = Column(Integer, ForeignKey("ciclos.id_ciclo", ondelete="CASCADE"), nullable=False)
    nivel_educativo = Column(String(50))
    activo = Column(Boolean, default=True)
    
    # Relaciones
    ciclo = relationship("Ciclo", back_populates="cursos")
    temas = relationship("Tema", back_populates="curso")
    grupos = relationship("Grupo", back_populates="curso")

class Tema(Base):
    __tablename__ = "temas"

    id_tema = Column(Integer, primary_key=True, index=True)
    id_curso = Column(Integer, ForeignKey("cursos.id_curso", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(200), nullable=False)
    descripcion = Column(Text)
    duracion_estimada_horas = Column(Integer)
    orden = Column(Integer)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    curso = relationship("Curso", back_populates="temas")
    asistencias_docentes = relationship("AsistenciaDocente", back_populates="tema")
    progresos = relationship("ProgresoTema", back_populates="tema")

class Grupo(Base):
    __tablename__ = "grupos"

    id_grupo = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(10), nullable=False)
    id_curso = Column(Integer, ForeignKey("cursos.id_curso", ondelete="CASCADE"), nullable=False)
    id_docente = Column(Integer, ForeignKey("docentes.id_usuario"))
    capacidad_maxima = Column(Integer, default=20)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    curso = relationship("Curso", back_populates="grupos")
    docente = relationship("Docente", back_populates="grupos")
    horarios = relationship("Horario", back_populates="grupo")
    matricula_grupos = relationship("MatriculaGrupo", back_populates="grupo")
    asistencias_docentes = relationship("AsistenciaDocente", back_populates="grupo")
    asistencias_estudiantes = relationship("AsistenciaEstudiante", back_populates="grupo")
    progresos = relationship("ProgresoTema", back_populates="grupo")
    incidencias = relationship("Incidencia", back_populates="grupo")

class Horario(Base):
    __tablename__ = "horarios"

    id_horario = Column(Integer, primary_key=True, index=True)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo", ondelete="CASCADE"), nullable=False)
    dia_semana = Column(String(15), nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    aula = Column(String(50))
    
    # Relación
    grupo = relationship("Grupo", back_populates="horarios")

class Matricula(Base):
    __tablename__ = "matriculas"

    id_matricula = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("estudiantes.id_usuario", ondelete="CASCADE"), nullable=False)
    id_ciclo = Column(Integer, ForeignKey("ciclos.id_ciclo", ondelete="CASCADE"), nullable=False)
    id_modalidad = Column(Integer, ForeignKey("modalidades.id_modalidad"), nullable=False)
    fecha_matricula = Column(DateTime, default=datetime.now)
    estado = Column(String(20), default='activa')
    
    # Relaciones
    estudiante = relationship("Estudiante", back_populates="matriculas")
    ciclo = relationship("Ciclo", back_populates="matriculas")
    modalidad = relationship("Modalidad", back_populates="matriculas")
    matricula_grupos = relationship("MatriculaGrupo", back_populates="matricula")
    pagos = relationship("Pago", back_populates="matricula")

class MatriculaGrupo(Base):
    __tablename__ = "matricula_grupos"

    id = Column(Integer, primary_key=True, index=True)
    id_matricula = Column(Integer, ForeignKey("matriculas.id_matricula", ondelete="CASCADE"), nullable=False)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo", ondelete="CASCADE"), nullable=False)
    fecha_inscripcion = Column(DateTime, default=datetime.now)
    
    # Relaciones
    matricula = relationship("Matricula", back_populates="matricula_grupos")
    grupo = relationship("Grupo", back_populates="matricula_grupos")

class ConceptoPago(Base):
    __tablename__ = "conceptos_pago"

    id_concepto = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    monto_base = Column(Numeric(8, 2))
    activo = Column(Boolean, default=True)

class Pago(Base):
    __tablename__ = "pagos"

    id_pago = Column(Integer, primary_key=True, index=True)
    id_matricula = Column(Integer, ForeignKey("matriculas.id_matricula", ondelete="CASCADE"), nullable=False)
    id_concepto = Column(Integer, ForeignKey("conceptos_pago.id_concepto"), nullable=False)
    mes_pagado = Column(Integer)
    año_pagado = Column(Integer)
    monto = Column(Numeric(8, 2), nullable=False)
    fecha_pago = Column(DateTime, default=datetime.now)
    metodo_pago = Column(String(50))
    observaciones = Column(Text)
    estado = Column(String(20), default='confirmado')
    
    # Relaciones
    matricula = relationship("Matricula", back_populates="pagos")
    concepto = relationship("ConceptoPago")

class AsistenciaDocente(Base):
    __tablename__ = "asistencia_docentes"

    id_asistencia = Column(Integer, primary_key=True, index=True)
    id_docente = Column(Integer, ForeignKey("docentes.id_usuario"), nullable=False)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora_entrada = Column(Time)
    hora_salida = Column(Time)
    id_tema_trabajado = Column(Integer, ForeignKey("temas.id_tema"))
    observaciones = Column(Text)
    tipo_registro = Column(String(20), default='manual')
    created_at = Column(DateTime, default=datetime.now)
    
    # Relaciones
    docente = relationship("Docente", back_populates="asistencias")
    grupo = relationship("Grupo", back_populates="asistencias_docentes")
    tema = relationship("Tema", back_populates="asistencias_docentes")

class AsistenciaEstudiante(Base):
    __tablename__ = "asistencia_estudiantes"

    id_asistencia = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("estudiantes.id_usuario"), nullable=False)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo"), nullable=False)
    fecha = Column(Date, nullable=False)
    presente = Column(Boolean, default=True)
    hora_entrada = Column(Time)
    hora_salida = Column(Time)
    observaciones = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relaciones
    estudiante = relationship("Estudiante", back_populates="asistencias")
    grupo = relationship("Grupo", back_populates="asistencias_estudiantes")

class TipoIncidencia(Base):
    __tablename__ = "tipos_incidencia"

    id_tipo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    descripcion = Column(Text)
    nivel_gravedad = Column(Integer, default=1)

class Incidencia(Base):
    __tablename__ = "incidencias"

    id_incidencia = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("estudiantes.id_usuario"), nullable=False)
    id_tipo = Column(Integer, ForeignKey("tipos_incidencia.id_tipo"), nullable=False)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo"))
    fecha_incidencia = Column(DateTime, default=datetime.now)
    descripcion = Column(Text)
    accion_tomada = Column(Text)
    notificado_padre = Column(Boolean, default=False)
    fecha_notificacion = Column(DateTime)
    created_by = Column(Integer, ForeignKey("administradores.id_usuario"))
    
    # Relaciones
    estudiante = relationship("Estudiante", back_populates="incidencias")
    tipo = relationship("TipoIncidencia")
    grupo = relationship("Grupo", back_populates="incidencias")
    administrador = relationship("Administrador")

class Notificacion(Base):
    __tablename__ = "notificaciones"

    id_notificacion = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("estudiantes.id_usuario"))
    tipo = Column(String(50), nullable=False)
    titulo = Column(String(200), nullable=False)
    mensaje = Column(Text, nullable=False)
    destinatario = Column(String(20), nullable=False)
    telefono_destinatario = Column(String(20))
    email_destinatario = Column(String(150))
    enviado = Column(Boolean, default=False)
    fecha_envio = Column(DateTime)
    metodo_envio = Column(String(20))
    created_at = Column(DateTime, default=datetime.now)
    
    # Relación
    estudiante = relationship("Estudiante")

class ProgresoTema(Base):
    __tablename__ = "progreso_temas"

    id_progreso = Column(Integer, primary_key=True, index=True)
    id_grupo = Column(Integer, ForeignKey("grupos.id_grupo"), nullable=False)
    id_tema = Column(Integer, ForeignKey("temas.id_tema"), nullable=False)
    fecha_planificada = Column(Date)
    fecha_ejecutada = Column(Date)
    completado = Column(Boolean, default=False)
    observaciones = Column(Text)
    
    # Relaciones
    grupo = relationship("Grupo", back_populates="progresos")
    tema = relationship("Tema", back_populates="progresos")