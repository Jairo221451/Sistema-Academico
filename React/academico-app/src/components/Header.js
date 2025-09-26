// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;