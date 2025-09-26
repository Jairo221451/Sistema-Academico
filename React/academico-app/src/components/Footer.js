// src/components/Footer.js
import React from 'react';

const Footer = ({ connectionStatus }) => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <p className="mb-1">
              <i className="bi bi-c-circle me-1"></i>
              2024 Academia Preuniversitaria. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <p className="mb-0">
              Estado: 
              <span className={`status ms-2 ${connectionStatus}`}>
                <i className={`bi ${
                  connectionStatus === 'connected' ? 'bi-wifi' :
                  connectionStatus === 'disconnected' ? 'bi-wifi-off' : 
                  'bi-hourglass-split'
                } me-1`}></i>
                {connectionStatus === 'connected' ? 'Conectado' :
                 connectionStatus === 'disconnected' ? 'Desconectado' : 
                 'Verificando'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;