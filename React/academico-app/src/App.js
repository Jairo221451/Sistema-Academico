import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import api from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistroForm from './pages/RegistroForm';
import LoginForm from './pages/LoginForm';

// Componente que controla la visibilidad del Header y Footer
const Layout = ({ children, connectionStatus }) => {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/registro'].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main>
        {children}
      </main>
      {!hideHeaderFooter && <Footer connectionStatus={connectionStatus} />}
    </>
  );
};

// Componente Hero con Bootstrap
const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-10">
            <h1 className="hero-title text-shadow mb-4">
              Tu camino hacia la universidad comienza aquí
            </h1>
            <p className="hero-subtitle lead mb-4">
              Sistema integral de preparación preuniversitaria con metodología especializada
              <br className="d-none d-md-block" />
              para cada carrera
            </p>
            <a href="/registro" className="btn btn-primary btn-lg px-5 py-3 text-decoration-none">
              <i className="bi bi-rocket-takeoff me-2"></i>
              Comienza tu Preparación
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente de Especialidades con Bootstrap
const Especialidades = () => {
  const grupos = [
    {
      id: 'A',
      nombre: 'Grupo A',
      carrera: 'Ingeniería',
      descripcion: 'Preparación especializada para carreras de Ingeniería',
      cursos: ['Matemática', 'Física', 'Química', 'Razonamiento Matemático'],
      icon: '⚗️',
      color: 'primary'
    },
    {
      id: 'B',
      nombre: 'Grupo B',
      carrera: 'Ciencias de la Salud',
      descripcion: 'Preparación para carreras de Medicina y Ciencias de la Salud',
      cursos: ['Biología', 'Química', 'Física', 'Razonamiento Verbal'],
      icon: '💊',
      color: 'success'
    },
    {
      id: 'C',
      nombre: 'Grupo C',
      carrera: 'Ciencias Contables',
      descripcion: 'Preparación para carreras de Administración y Contabilidad',
      cursos: ['Matemática', 'Razonamiento Matemático', 'Historia del Perú', 'Geografía'],
      icon: '💼',
      color: 'warning'
    },
    {
      id: 'D',
      nombre: 'Grupo D',
      carrera: 'Derecho',
      descripcion: 'Preparación para carreras de Derecho y Ciencias Sociales',
      cursos: ['Razonamiento Verbal', 'Historia del Perú', 'Geografía', 'Filosofía'],
      icon: '⚖️',
      color: 'info'
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Elige tu Especialidad</h2>
            <p className="lead text-muted">
              Programas diseñados específicamente para tu carrera universitaria
            </p>
          </div>
        </div>
        
        <div className="row g-4">
          {grupos.map((grupo) => (
            <div key={grupo.id} className="col-lg-6 col-xl-3">
              <div className="card custom-card h-100 grupo-card fade-in-up">
                <div className="card-body">
                  <div className="grupo-icon mb-3">{grupo.icon}</div>
                  <h3 className="grupo-nombre h5">{grupo.nombre}</h3>
                  <h4 className={`grupo-carrera text-${grupo.color}`}>{grupo.carrera}</h4>
                  <p className="card-text text-muted">{grupo.descripcion}</p>
                  
                  <div className="cursos-incluidos mt-auto">
                    <strong className="d-block mb-2">
                      <i className="bi bi-book me-1"></i>
                      Cursos incluidos:
                    </strong>
                    <ul className="mb-0">
                      {grupo.cursos.map((curso, index) => (
                        <li key={index} className="text-muted">{curso}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="card-footer bg-transparent border-0 pt-0">
                  <button className={`btn btn-outline-${grupo.color} w-100`}>
                    <i className="bi bi-arrow-right me-1"></i>
                    Más información
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente de Características con Bootstrap
const Caracteristicas = () => {
  const features = [
    {
      icon: 'bi-people',
      title: 'Matrícula Fácil',
      description: 'Sistema de registro simple y rápido para estudiantes',
      color: 'primary'
    },
    {
      icon: 'bi-books',
      title: 'Cursos Especializados',
      description: '24 cursos diseñados específicamente para cada carrera',
      color: 'success'
    },
    {
      icon: 'bi-calendar-check',
      title: 'Horarios Flexibles',
      description: 'Reserva tus clases y genera tu horario automáticamente',
      color: 'warning'
    },
    {
      icon: 'bi-shield-check',
      title: 'Pagos Seguros',
      description: 'Sistema de registro de pagos confiable y transparente',
      color: 'info'
    },
    {
      icon: 'bi-bell',
      title: 'Notificaciones',
      description: 'Recibe confirmaciones y recordatorios importantes',
      color: 'secondary'
    },
    {
      icon: 'bi-mortarboard',
      title: 'Preparación Integral',
      description: 'Metodología probada para el éxito universitario',
      color: 'danger'
    }
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">¿Por qué elegirnos?</h2>
            <p className="lead text-muted">
              Herramientas y metodología para tu éxito académico
            </p>
          </div>
        </div>
        
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="feature-card shadow-custom fade-in-up">
                <i className={`bi ${feature.icon} text-${feature.color} feature-icon`}></i>
                <h3 className="feature-title h5">{feature.title}</h3>
                <p className="text-muted mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente de Estadísticas con Bootstrap
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

  const statsData = [
    { 
      number: stats.total_estudiantes, 
      label: 'Estudiantes', 
      icon: 'bi-people',
      color: 'primary' 
    },
    { 
      number: stats.total_docentes, 
      label: 'Docentes', 
      icon: 'bi-person-badge',
      color: 'success' 
    },
    { 
      number: stats.total_cursos, 
      label: 'Cursos', 
      icon: 'bi-book-half',
      color: 'warning' 
    },
    { 
      number: stats.total_matriculas, 
      label: 'Matrículas', 
      icon: 'bi-clipboard-check',
      color: 'info' 
    }
  ];

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando estadísticas...</span>
              </div>
              <p className="mt-3 text-muted">Cargando estadísticas...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-4 fw-bold">Nuestros Números</h2>
          </div>
        </div>
        
        <div className="row g-4">
          {statsData.map((stat, index) => (
            <div key={index} className="col-6 col-lg-3">
              <div className="stat-card text-center fade-in-up">
                <i className={`bi ${stat.icon} text-${stat.color} mb-3`} style={{fontSize: '2.5rem'}}></i>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente CTA con Bootstrap
const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h2 className="cta-title text-shadow mb-3">¿Listo para comenzar?</h2>
            <p className="cta-subtitle">
              Únete a cientos de estudiantes que han logrado ingresar a la universidad de sus sueños
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <a href="/registro" className="btn btn-accent btn-lg px-5 text-decoration-none">
                <i className="bi bi-person-plus-fill me-2"></i>
                Registrarse Ahora
              </a>
              <a href="/login" className="btn btn-outline-light btn-lg px-5 text-decoration-none">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Ya tengo cuenta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Principal de la Página de Inicio
const HomePage = () => {
  return (
    <>
      <Hero />
      <Especialidades />
      <Caracteristicas />
      <Estadisticas />
      <CallToAction />
    </>
  );
};

// Componente Principal App
function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
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

  const handleRegistroSuccess = (newStudent) => {
    console.log('Nuevo estudiante registrado:', newStudent);
  };

  const handleLoginSuccess = (userData) => {
    console.log('Usuario autenticado:', userData);
  };

  return (
    <Router>
      <div className="App">
        {/* Alert de conexión */}
        {connectionStatus === 'disconnected' && (
          <div className="alert alert-warning connection-alert mb-0" role="alert">
            <div className="container-fluid">
              <i className="bi bi-exclamation-triangle me-2"></i>
              No se pudo conectar con el servidor. Asegúrate de que el backend esté funcionando.
            </div>
          </div>
        )}
        
        <Layout connectionStatus={connectionStatus}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/registro" 
              element={
                <RegistroForm 
                  onSuccess={handleRegistroSuccess}
                />
              } 
            />
            <Route 
              path="/login" 
              element={
                <LoginForm 
                  onSuccess={handleLoginSuccess}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;