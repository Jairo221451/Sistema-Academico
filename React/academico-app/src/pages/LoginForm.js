// src/pages/LoginForm.jsx
import React, { useState } from 'react';
import './RegistroForm.css'; // Reutilizamos los mismos estilos
import api from '../api';

const LoginForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
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
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor ingrese su email y contraseña');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingrese un email válido');
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
      // Enviar credenciales al backend
      const response = await api.post('/api/auth/login', formData);

      console.log('Inicio de sesión exitoso:', response.data);

      // Si el backend devuelve un token o datos de usuario
      if (onSuccess) onSuccess(response.data);

      onClose(); // Cierra el modal después del login
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña');
        } else if (status === 400) {
          setError('Datos inválidos en el formulario');
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

  return (
    <form className="registro-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="logo">🎓 Academia Preuniversitaria</div>
        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus credenciales para acceder a tu cuenta</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Correo Electrónico *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu.email@ejemplo.com"
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
        <button type="button" className="btn-link" onClick={onClose}>
          ← Volver al inicio
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
