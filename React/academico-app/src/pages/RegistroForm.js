import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistroForm.css'; 
import { apiService } from '../api';

// Componente de Éxito
const RegistroSuccess = ({ userData }) => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="registro-success">
      <div className="success-icon">✓</div>
      <h3>¡Registro Exitoso!</h3>
      <p>
        Bienvenido(a) <strong>{userData?.nombre} {userData?.apellido}</strong>
      </p>
      <p>
        Tu registro ha sido completado correctamente. 
        Ya puedes iniciar sesión con tu usuario y contraseña.
      </p>
      <div className="success-actions">
        <button 
          className="btn-submit"
          onClick={handleContinue}
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
};

// Componente Principal
const RegistroForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: {
      username: '',
      email: '',
      password: '',
      tipo_usuario: 'estudiante'
    },
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    nombre_padre: '',
    telefono_padre: '',
    email_padre: '',
    nivel_educativo: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('usuario.')) {
      const usuarioField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        usuario: {
          ...prev.usuario,
          [usuarioField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    // Validar campos de usuario
    if (!formData.usuario.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }
    if (!formData.usuario.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.usuario.email)) {
      setError('Por favor ingrese un email válido');
      return false;
    }
    if (!formData.usuario.password.trim()) {
      setError('La contraseña es obligatoria');
      return false;
    }
    if (formData.usuario.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar campos de estudiante
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es obligatorio');
      return false;
    }
    if (formData.dni && (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni))) {
      setError('El DNI debe tener 8 dígitos');
      return false;
    }
    if (formData.telefono && (formData.telefono.length < 9 || !/^\d+$/.test(formData.telefono))) {
      setError('El teléfono debe tener al menos 9 dígitos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.registerStudent(formData);
      console.log('Usuario registrado exitosamente:', response.data);
      
      if (onSuccess) onSuccess(response.data);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          if (errorData.detail) {
            setError(`Error: ${errorData.detail}`);
          } else {
            setError('Los datos ingresados no son válidos');
          }
        } else if (status === 409) {
          setError('El username o email ya está registrado');
        } else {
          setError('Error en el servidor. Intente nuevamente más tarde');
        }
      } else if (error.request) {
        setError('Error de conexión. Verifique su conexión a internet');
      } else {
        setError('Error inesperado. Intente nuevamente');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div className="registro-page">
        <div className="container">
          <RegistroSuccess userData={formData} />
        </div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <div className="container">
        <div className="page-header">
          <button className="btn-back" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i>
            Volver al Inicio
          </button>
        </div>
        
        <div className="form-container">
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div className="logo">🎓 Academia Preuniversitaria</div>
              <h2>Registro de Estudiante</h2>
              <p>
                Completa tu información para crear tu cuenta
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Información de Usuario */}
            <section>
              <h3>Datos de Acceso</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Usuario *</label>
                  <input
                    type="text"
                    name="usuario.username"
                    value={formData.usuario.username}
                    onChange={handleChange}
                    placeholder="juan.perez"
                    required
                  />
                  <small className="form-help">Será tu nombre de usuario para iniciar sesión</small>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="usuario.email"
                    value={formData.usuario.email}
                    onChange={handleChange}
                    placeholder="tu.email@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  name="usuario.password"
                  value={formData.usuario.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <small className="form-help">La contraseña debe tener al menos 6 caracteres</small>
              </div>
            </section>

            {/* Información Personal */}
            <section>
              <h3>Información Personal</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan Carlos"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Pérez García"
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>DNI</label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="87654321"
                    maxLength="8"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="987654321"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Tu dirección completa"
                />
              </div>

              <div className="form-group">
                <label>Nivel Educativo</label>
                <input
                  type="text"
                  name="nivel_educativo"
                  value={formData.nivel_educativo}
                  onChange={handleChange}
                  placeholder="Ej: 5to de secundaria"
                />
              </div>
            </section>

            {/* Información del Padre/Tutor */}
            <section>
              <h3>Información del Padre/Tutor (Opcional)</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre del Padre/Tutor</label>
                  <input
                    type="text"
                    name="nombre_padre"
                    value={formData.nombre_padre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono del Padre/Tutor</label>
                  <input
                    type="tel"
                    name="telefono_padre"
                    value={formData.telefono_padre}
                    onChange={handleChange}
                    placeholder="987654321"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email del Padre/Tutor</label>
                <input
                  type="email"
                  name="email_padre"
                  value={formData.email_padre}
                  onChange={handleChange}
                  placeholder="padre@ejemplo.com"
                />
              </div>
            </section>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <div className="form-footer">
              <p className="info-text">
                📝 Los campos marcados con * son obligatorios
              </p>
              <p>¿Ya tienes cuenta? 
                <button type="button" className="btn-link" onClick={handleLoginRedirect}>
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroForm;