import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../api';

const Header = ({ user }) => {
  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="custom-header">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
            <span className="logo-icon me-2">🎓</span>
            <span className="logo-text">Academia Preuniversitaria</span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-dark">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.nombre || user.username}
                </span>
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm text-decoration-none">
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Salir
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2">
                <Link to="/login" className="btn btn-outline-primary text-decoration-none">
                  <i className="bi bi-person me-1"></i>
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-primary text-decoration-none">
                  <i className="bi bi-person-plus me-1"></i>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;