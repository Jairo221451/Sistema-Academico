import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response) {
      // El servidor respondió con un error
      console.error('Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // La request fue hecha pero no hay respuesta
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funciones específicas para cada endpoint
export const apiService = {
  // Endpoints de prueba
  testConnection: () => api.get('/'),
  testDatabase: () => api.get('/test-db'),
  
  // Estadísticas
  getStats: () => api.get('/estadisticas/'),
  
  // Estudiantes
  createStudent: (data) => api.post('/estudiantes/', data),
  getStudents: () => api.get('/estudiantes/'),
  getStudent: (id) => api.get(`/estudiantes/${id}`),
  getStudentEnrollments: (id) => api.get(`/estudiantes/${id}/matriculas/`),
  
  // Docentes
  createTeacher: (data) => api.post('/docentes/', data),
  getTeachers: () => api.get('/docentes/'),
  
  // Ciclos
  createCycle: (data) => api.post('/ciclos/', data),
  getCycles: () => api.get('/ciclos/'),
  getCycle: (id) => api.get(`/ciclos/${id}`),
  getCycleCourses: (id) => api.get(`/ciclos/${id}/cursos/`),
  
  // Cursos
  createCourse: (data) => api.post('/cursos/', data),
  getCourses: () => api.get('/cursos/'),
  getCourseSchedules: (id) => api.get(`/cursos/${id}/horarios/`),
  
  // Horarios
  createSchedule: (data) => api.post('/horarios/', data),
  getSchedules: () => api.get('/horarios/'),
  
  // Matrículas
  createEnrollment: (data) => api.post('/matriculas/', data),
  getEnrollments: () => api.get('/matriculas/'),
};

// Función helper para manejar errores de forma consistente
export const handleApiError = (error, defaultMessage = 'Ha ocurrido un error') => {
  if (error.response && error.response.data && error.response.data.detail) {
    return error.response.data.detail;
  }
  return defaultMessage;
};

// Función para verificar el estado de conexión
export const checkConnection = async () => {
  try {
    await api.get('/', { timeout: 5000 });
    return { status: 'connected', message: 'Conexión exitosa' };
  } catch (error) {
    return { 
      status: 'disconnected', 
      message: 'No se pudo conectar con el servidor' 
    };
  }
};

export default api;