import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, apiService } from '../api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Obtener datos del usuario autenticado
        const authData = authService.getAuthData();
        setUserData(authData);

        // Obtener estadísticas si están disponibles
        try {
          const response = await apiService.getStats();
          setStats(response.data);
        } catch (error) {
          console.log('No se pudieron cargar las estadísticas:', error);
        }

      } catch (error) {
        console.error('Error al inicializar dashboard:', error);
        // Si hay error de autenticación, redirigir al login
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    authService.logout();
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const userInfo = userData?.user || user;
  const studentInfo = userData?.student;
  const teacherInfo = userData?.teacher;
  const adminInfo = userData?.admin;

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header del Dashboard */}
        <div className="dashboard-header">
          <div className="row align-items-center mb-4">
            <div className="col-md-8">
              <h1 className="dashboard-title">
                Bienvenido, {studentInfo?.nombre || teacherInfo?.nombre || adminInfo?.nombre || userInfo?.username}
              </h1>
              <p className="dashboard-subtitle text-muted">
                Panel de control - {userInfo?.tipo_usuario || 'Usuario'}
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                  Información Personal
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Usuario:</strong> {userInfo?.username}</p>
                    <p><strong>Email:</strong> {userInfo?.email}</p>
                    <p><strong>Tipo de Usuario:</strong> {userInfo?.tipo_usuario}</p>
                  </div>
                  <div className="col-md-6">
                    {studentInfo && (
                      <>
                        <p><strong>Nombre Completo:</strong> {studentInfo.nombre} {studentInfo.apellido}</p>
                        <p><strong>DNI:</strong> {studentInfo.dni || 'No registrado'}</p>
                        <p><strong>Teléfono:</strong> {studentInfo.telefono || 'No registrado'}</p>
                      </>
                    )}
                    {teacherInfo && (
                      <>
                        <p><strong>Nombre Completo:</strong> {teacherInfo.nombre} {teacherInfo.apellido}</p>
                        <p><strong>Especialidad:</strong> {teacherInfo.especialidad || 'No especificada'}</p>
                      </>
                    )}
                    {adminInfo && (
                      <>
                        <p><strong>Nombre Completo:</strong> {adminInfo.nombre} {adminInfo.apellido}</p>
                        <p><strong>Cargo:</strong> {adminInfo.cargo || 'Administrador'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Acciones Rápidas
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {userInfo?.tipo_usuario === 'estudiante' && (
                    <>
                      <div className="col-md-3">
                        <button className="btn btn-primary w-100">
                          <i className="bi bi-book me-2"></i>
                          Mis Cursos
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-success w-100">
                          <i className="bi bi-calendar-check me-2"></i>
                          Horarios
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-info w-100">
                          <i className="bi bi-credit-card me-2"></i>
                          Pagos
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-warning w-100">
                          <i className="bi bi-graph-up me-2"></i>
                          Notas
                        </button>
                      </div>
                    </>
                  )}
                  
                  {userInfo?.tipo_usuario === 'docente' && (
                    <>
                      <div className="col-md-3">
                        <button className="btn btn-primary w-100">
                          <i className="bi bi-book me-2"></i>
                          Mis Clases
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-success w-100">
                          <i className="bi bi-people me-2"></i>
                          Estudiantes
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-info w-100">
                          <i className="bi bi-calendar-week me-2"></i>
                          Horarios
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-warning w-100">
                          <i className="bi bi-clipboard-data me-2"></i>
                          Evaluaciones
                        </button>
                      </div>
                    </>
                  )}

                  {userInfo?.tipo_usuario === 'administrador' && (
                    <>
                      <div className="col-md-3">
                        <button className="btn btn-primary w-100">
                          <i className="bi bi-people me-2"></i>
                          Usuarios
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-success w-100">
                          <i className="bi bi-building me-2"></i>
                          Ciclos
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-info w-100">
                          <i className="bi bi-book-half me-2"></i>
                          Cursos
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-warning w-100">
                          <i className="bi bi-graph-up me-2"></i>
                          Reportes
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas (si están disponibles) */}
        {stats && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-bar-chart me-2"></i>
                    Estadísticas del Sistema
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="stat-item text-center">
                        <i className="bi bi-people text-primary mb-2" style={{fontSize: '2rem'}}></i>
                        <h4>{stats.total_estudiantes}</h4>
                        <p className="text-muted mb-0">Estudiantes</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-item text-center">
                        <i className="bi bi-person-badge text-success mb-2" style={{fontSize: '2rem'}}></i>
                        <h4>{stats.total_docentes}</h4>
                        <p className="text-muted mb-0">Docentes</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-item text-center">
                        <i className="bi bi-book-half text-warning mb-2" style={{fontSize: '2rem'}}></i>
                        <h4>{stats.total_cursos}</h4>
                        <p className="text-muted mb-0">Cursos</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-item text-center">
                        <i className="bi bi-clipboard-check text-info mb-2" style={{fontSize: '2rem'}}></i>
                        <h4>{stats.total_matriculas}</h4>
                        <p className="text-muted mb-0">Matrículas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;