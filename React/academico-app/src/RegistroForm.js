import React, { useState } from 'react';
import './RegistroForm.css'; 
import api from './api';

// Modal Component
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-content">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// Componente de Éxito
const RegistroSuccess = ({ onClose, studentData }) => (
  <div className="registro-success">
    <div className="success-icon">✓</div>
    <h3>¡Registro Exitoso!</h3>
    <p>
      Bienvenido(a) <strong>{studentData?.nombre} {studentData?.apellido}</strong>
    </p>
    <p>
      Tu registro ha sido completado correctamente. 
      Recibirás un correo de confirmación en breve.
    </p>
    <button 
      className="btn-submit"
      onClick={onClose}
    >
      Continuar
    </button>
  </div>
);

// Componente Principal
const RegistroForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    const requiredFields = ['nombre', 'apellido', 'email', 'telefono'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      setError('Por favor complete todos los campos obligatorios');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingrese un email válido');
      return false;
    }
    if (formData.telefono.length < 9 || !/^\d+$/.test(formData.telefono)) {
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
      // Ya tenemos nombre y apellido separados en el formData
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono
      };
      
      const response = await api.post('/api/estudiantes/', dataToSend);
      console.log('Estudiante registrado exitosamente:', response.data);
      
      if (onSuccess) onSuccess(response.data);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error al registrar estudiante:', error);
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              const errorMessages = errorData.detail.map(err => err.msg).join(', ');
              setError(`Error de validación: ${errorMessages}`);
            } else {
              setError(`Error: ${errorData.detail}`);
            }
          } else {
            setError('Los datos ingresados no son válidos');
          }
        } else if (status === 409) {
          setError('El email ya está registrado');
        } else if (status === 422) {
          setError('Los datos ingresados no tienen el formato correcto');
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

  if (success) {
    return <RegistroSuccess onClose={onClose} studentData={formData} />;
  }

  return (
    <form className="registro-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="logo">🎓 Academia Preuniversitaria</div>
        <h2>Registro de Estudiante</h2>
        <p>
          Completa tu información básica para crear tu cuenta
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Información Personal Básica */}
      <section>
        <h3>Información Personal</h3>
        
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
          <label>Teléfono *</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="987654321"
            required
          />
          <small className="form-help">Número de teléfono para contactarte</small>
        </div>
      </section>

      <button type="submit" className="btn-submit" disabled={isLoading}>
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <div className="form-footer">
        <p className="info-text">
          📝 Este es un registro básico. Podrás completar más información después de crear tu cuenta.
        </p>
        <p>¿Ya tienes cuenta? <button type="button" onClick={onClose}>Inicia sesión aquí</button></p>
        <button type="button" className="btn-link" onClick={onClose}>
          ← Volver al inicio
        </button>
      </div>
    </form>
  );
};

export default RegistroForm;
