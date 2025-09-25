import React, { useState, useEffect } from 'react';
import './App.css';
import api from './api';

// Componente Header
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Academia Preuniversitaria</span>
        </div>
        <div className="auth-buttons">
          <button className="btn btn-outline">Iniciar Sesión</button>
          <button className="btn btn-primary">Registrarse</button>
        </div>
      </div>
    </header>
  );
};

// Componente Hero
const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">Tu camino hacia la universidad comienza aquí</h1>
        <p className="hero-subtitle">
          Sistema integral de preparación preuniversitaria con metodología especializada
          <br />para cada carrera
        </p>
        <button className="btn btn-primary btn-large">
          Comienza tu Preparación
        </button>
      </div>
    </section>
  );
};

// Componente de Especialidades
const Especialidades = () => {
  const grupos = [
    {
      id: 'A',
      nombre: 'Grupo A',
      carrera: 'Ingeniería',
      descripcion: 'Preparación especializada para carreras de Ingeniería',
      cursos: ['Matemática', 'Física', 'Química', 'Razonamiento Matemático'],
      icon: '⚗️'
    },
    {
      id: 'B',
      nombre: 'Grupo B',
      carrera: 'Ciencias de la Salud',
      descripcion: 'Preparación para carreras de Medicina y Ciencias de la Salud',
      cursos: ['Biología', 'Química', 'Física', 'Razonamiento Verbal'],
      icon: '💊'
    },
    {
      id: 'C',
      nombre: 'Grupo C',
      carrera: 'Ciencias Contables',
      descripcion: 'Preparación para carreras de Administración y Contabilidad',
      cursos: ['Matemática', 'Razonamiento Matemático', 'Historia del Perú', 'Geografía'],
      icon: '💼'
    },
    {
      id: 'D',
      nombre: 'Grupo D',
      carrera: 'Derecho',
      descripcion: 'Preparación para carreras de Derecho y Ciencias Sociales',
      cursos: ['Razonamiento Verbal', 'Historia del Perú', 'Geografía', 'Filosofía'],
      icon: '⚖️'
    }
  ];

  return (
    <section className="especialidades">
      <div className="container">
        <h2 className="section-title">Elige tu Especialidad</h2>
        <p className="section-subtitle">Programas diseñados específicamente para tu carrera universitaria</p>
        
        <div className="grupos-grid">
          {grupos.map((grupo) => (
            <div key={grupo.id} className="grupo-card">
              <div className="grupo-icon">{grupo.icon}</div>
              <h3 className="grupo-nombre">{grupo.nombre}</h3>
              <h4 className="grupo-carrera">{grupo.carrera}</h4>
              <p className="grupo-descripcion">{grupo.descripcion}</p>
              <div className="cursos-incluidos">
                <strong>Cursos incluidos:</strong>
                <ul>
                  {grupo.cursos.map((curso, index) => (
                    <li key={index}>{curso}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente de Características
const Caracteristicas = () => {
  const features = [
    {
      icon: '👥',
      title: 'Matrícula Fácil',
      description: 'Sistema de registro simple y rápido para estudiantes'
    },
    {
      icon: '📚',
      title: 'Cursos Especializados',
      description: '24 cursos diseñados específicamente para cada carrera'
    },
    {
      icon: '📅',
      title: 'Horarios Flexibles',
      description: 'Reserva tus clases y genera tu horario automáticamente'
    },
    {
      icon: '💳',
      title: 'Pagos Seguros',
      description: 'Sistema de registro de pagos confiable y transparente'
    },
    {
      icon: '🔔',
      title: 'Notificaciones',
      description: 'Recibe confirmaciones y recordatorios importantes'
    },
    {
      icon: '🎓',
      title: 'Preparación Integral',
      description: 'Metodología probada para el éxito universitario'
    }
  ];

  return (
    <section className="caracteristicas">
      <div className="container">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <p className="section-subtitle">Herramientas y metodología para tu éxito académico</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente CTA (Call to Action)
const CallToAction = () => {
  return (
    <section className="cta">
      <div className="container">
        <h2 className="cta-title">¿Listo para comenzar?</h2>
        <p className="cta-subtitle">
          Únete a cientos de estudiantes que han logrado ingresar a la universidad de sus sueños
        </p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-large">
            Registrarse Ahora
          </button>
          <button className="btn btn-outline btn-large">
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente de Estadísticas (conectado al backend)
const Estadisticas = () => {
  const [stats, setStats] = useState({
    total_estudiantes: 0,
    total_docentes: 0,
    total_cursos: 0,
    total_matriculas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/estadisticas/');
        setStats(response.data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="estadisticas">
        <div className="container">
          <p>Cargando estadísticas...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="estadisticas">
      <div className="container">
        <h2 className="section-title">Nuestros Números</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total_estudiantes}</div>
            <div className="stat-label">Estudiantes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.total_docentes}</div>
            <div className="stat-label">Docentes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.total_cursos}</div>
            <div className="stat-label">Cursos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.total_matriculas}</div>
            <div className="stat-label">Matrículas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Principal App
function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    // Verificar conexión con el backend
    const checkConnection = async () => {
      try {
        await api.get('/');
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Error de conexión con el backend:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="App">
      {connectionStatus === 'disconnected' && (
        <div className="connection-alert">
          <div className="container">
            ⚠️ No se pudo conectar con el servidor. Asegúrate de que el backend esté funcionando.
          </div>
        </div>
      )}
      
      <Header />
      <Hero />
      <Especialidades />
      <Caracteristicas />
      <Estadisticas />
      <CallToAction />
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Academia Preuniversitaria. Todos los derechos reservados.</p>
          <p>Estado de conexión: <span className={`status ${connectionStatus}`}>{connectionStatus}</span></p>
        </div>
      </footer>
    </div>
  );
}

export default App;