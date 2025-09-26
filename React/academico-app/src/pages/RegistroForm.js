import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistroForm.css'; 
import api from '../api';

// Componente de Éxito
const RegistroSuccess = ({ studentData }) => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/');
  };

  return (
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
          <RegistroSuccess studentData={formData} />
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
                Completa tu información básica para crear tu cuenta
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Información Personal Básica */}
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