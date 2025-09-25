from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Time, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Estudiante(Base):
    __tablename__ = "estudiantes"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    telefono = Column(String(20))
    
    # Relación con matrículas
    matriculas = relationship("Matricula", back_populates="estudiante")

class Docente(Base):
    __tablename__ = "docentes"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    telefono = Column(String(20))

class Administrador(Base):
    __tablename__ = "administradores"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    telefono = Column(String(20))

class Ciclo(Base):
    __tablename__ = "ciclos"

    id_ciclo = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    
    # Relaciones
    cursos = relationship("Curso", back_populates="ciclo")
    matriculas = relationship("Matricula", back_populates="ciclo")

class Curso(Base):
    __tablename__ = "cursos"

    id_curso = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text)
    id_ciclo = Column(Integer, ForeignKey("ciclos.id_ciclo", ondelete="CASCADE"))
    
    # Relaciones
    ciclo = relationship("Ciclo", back_populates="cursos")
    horarios = relationship("Horario", back_populates="curso")

class Horario(Base):
    __tablename__ = "horarios"

    id_horario = Column(Integer, primary_key=True, index=True)
    id_curso = Column(Integer, ForeignKey("cursos.id_curso", ondelete="CASCADE"))
    dia_semana = Column(String(15), nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    aula = Column(String(50))
    
    # Relación
    curso = relationship("Curso", back_populates="horarios")

class Matricula(Base):
    __tablename__ = "matriculas"

    id_matricula = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("estudiantes.id_usuario", ondelete="CASCADE"))
    id_ciclo = Column(Integer, ForeignKey("ciclos.id_ciclo", ondelete="CASCADE"))
    fecha_matricula = Column(DateTime, default=datetime.now)
    
    # Relaciones
    estudiante = relationship("Estudiante", back_populates="matriculas")
    ciclo = relationship("Ciclo", back_populates="matriculas")