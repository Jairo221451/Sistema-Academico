import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { apiService } from '../api';

const LoginForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor ingrese su usuario y contraseña');
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
      const response = await apiService.login(formData);
      console.log('Inicio de sesión exitoso:', response.data);

      if (onSuccess) onSuccess(response.data);
      
      // Redirigir al dashboard o página principal después del login
      navigate('./Dashboard.js');

    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError('Credenciales incorrectas. Verifica tu usuario y contraseña');
        } else if (status === 401) {
          setError('Usuario inactivo o no autorizado');
        } else {
          setError('Error en el servidor. Intente nuevamente más tarde');
        }
      } else if (error.request) {
        setError('No se pudo conectar con el servidor');
      } else {
        setError('Error inesperado. Intente nuevamente');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistroRedirect = () => {
    navigate('/registro');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
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
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para acceder a tu cuenta</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Usuario *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="tu.usuario"
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className="form-footer">
              <p className="info-text">
                🔑 ¿Olvidaste tu contraseña? Contacta con el administrador.
              </p>
              <p>¿No tienes cuenta? 
                <button type="button" className="btn-link" onClick={handleRegistroRedirect}>
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;