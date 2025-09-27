import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      
      // Si el token expiró, redirigir al login
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La request fue hecha pero no hay respuesta
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funciones específicas para cada endpoint
export const apiService = {
  // Autenticación
  login: (data) => api.post('/api/auth/login', data),
  registerStudent: (data) => api.post('/api/auth/register/estudiante', data),
  verifyToken: () => api.get('/api/auth/verify'),
  
  // Endpoints de prueba
  testConnection: () => api.get('/'),
  testDatabase: () => api.get('/api/test-db'),
  
  // Estadísticas
  getStats: () => api.get('/api/estadisticas'),
  
  // Estudiantes
  getStudents: (skip = 0, limit = 100) => api.get(`/api/estudiantes?skip=${skip}&limit=${limit}`),
  getStudent: (id) => api.get(`/api/estudiantes/${id}`),
  
  // Docentes
  getTeachers: (skip = 0, limit = 100) => api.get(`/api/docentes?skip=${skip}&limit=${limit}`),
  
  // Ciclos
  createCycle: (data) => api.post('/api/ciclos', data),
  getCycles: (skip = 0, limit = 100) => api.get(`/api/ciclos?skip=${skip}&limit=${limit}`),
  getCycle: (id) => api.get(`/api/ciclos/${id}`),
  
  // Cursos
  createCourse: (data) => api.post('/api/cursos', data),
  getCourses: (skip = 0, limit = 100) => api.get(`/api/cursos?skip=${skip}&limit=${limit}`),
  getCycleCourses: (id) => api.get(`/api/ciclos/${id}/cursos`),
  
  // Matrículas
  createEnrollment: (data) => api.post('/api/matriculas', data),
  getEnrollments: (skip = 0, limit = 100) => api.get(`/api/matriculas?skip=${skip}&limit=${limit}`),
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

// Funciones para manejar la autenticación
export const authService = {
  // Guardar datos de autenticación en localStorage
  setAuthData: (data) => {
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    if (data.usuario) {
      localStorage.setItem('user_data', JSON.stringify(data.usuario));
    }
    if (data.estudiante) {
      localStorage.setItem('student_data', JSON.stringify(data.estudiante));
    }
    if (data.docente) {
      localStorage.setItem('teacher_data', JSON.stringify(data.docente));
    }
    if (data.administrador) {
      localStorage.setItem('admin_data', JSON.stringify(data.administrador));
    }
  },

  // Obtener datos de autenticación
  getAuthData: () => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    const studentData = localStorage.getItem('student_data');
    const teacherData = localStorage.getItem('teacher_data');
    const adminData = localStorage.getItem('admin_data');
    
    return {
      token,
      user: userData ? JSON.parse(userData) : null,
      student: studentData ? JSON.parse(studentData) : null,
      teacher: teacherData ? JSON.parse(teacherData) : null,
      admin: adminData ? JSON.parse(adminData) : null,
    };
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('student_data');
    localStorage.removeItem('teacher_data');
    localStorage.removeItem('admin_data');
    window.location.href = '/login';
  },

  // Obtener el tipo de usuario
  getUserType: () => {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return user.tipo_usuario;
  }
};

export default api;