import React, { useState } from 'react';
import './RegistroForm.css'; // Importamos los estilos

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
      Bienvenido(a) <strong>{studentData?.nombres}</strong>
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
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    email: '',
    direccion: '',
    fecha_nacimiento: '',
    nombre_apoderado: '',
    telefono_apoderado: '',
    password: '',
    confirmPassword: ''
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
    const requiredFields = ['nombres', 'apellidos', 'dni', 'telefono', 'email', 'password', 'confirmPassword'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      setError('Por favor complete todos los campos obligatorios');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingrese un email válido');
      return false;
    }
    if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      setError('El DNI debe tener exactamente 8 dígitos');
      return false;
    }
    if (formData.telefono.length !== 9 || !/^\d+$/.test(formData.telefono)) {
      setError('El teléfono debe tener exactamente 9 dígitos');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Estudiante registrado:', formData);
      if (onSuccess) onSuccess(formData);
      setSuccess(true);
    } catch (error) {
      console.error('Error al registrar estudiante:', error);
      setError('Error de conexión. Verifique su conexión a internet.');
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
          Completa tu información para crear tu cuenta y acceder al sistema de matrículas
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Información Personal */}
      <section>
        <h3>Información Personal</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Juan Pérez García"
              required
            />
          </div>
          <div className="form-group">
            <label>DNI *</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="12345678"
              maxLength="8"
              required
            />
          </div>
        </div>

        <div className="form-grid">
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
              maxLength="9"
              required
            />
          </div>
        </div>
      </section>

      {/* Información del Apoderado */}
      <section>
        <h3>Información del Apoderado</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre del Apoderado *</label>
            <input
              type="text"
              name="nombre_apoderado"
              value={formData.nombre_apoderado}
              onChange={handleChange}
              placeholder="María García Rodríguez"
            />
          </div>
          <div className="form-group">
            <label>Teléfono del Apoderado *</label>
            <input
              type="tel"
              name="telefono_apoderado"
              value={formData.telefono_apoderado}
              onChange={handleChange}
              placeholder="987654322"
              maxLength="9"
            />
          </div>
        </div>
      </section>

      {/* Credenciales */}
      <section>
        <h3>Credenciales de Acceso</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
            />
          </div>
        </div>
      </section>

      <button type="submit" className="btn-submit" disabled={isLoading}>
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <div className="form-footer">
        <p>¿Ya tienes cuenta? <button type="button" onClick={onClose}>Inicia sesión aquí</button></p>
        <button type="button" className="btn-link" onClick={onClose}>
          ← Volver al inicio
        </button>
      </div>
    </form>
  );
};

export default RegistroForm;
