import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logobranca.svg';
import ExternalLink from '../assets/External link.svg';
import supportIcon from '../assets/frame1.svg'; 
import analysisIcon from '../assets/frame2.svg';
import roomIcon from '../assets/frame3.svg';
import equipmentIcon from '../assets/frame4.svg';
import statusIcon from '../assets/frame5.svg';
import adminIcon from '../assets/frame6.svg';
import homeIcon from '../assets/frame7.svg';

function Sidebar() {
  const { logout, user } = useAuth();
  const [reservasOpen, setReservasOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isAdmin = user?.tipoUsuario === 'ADMINISTRADOR';

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo}/>
        <h2>Sala Mágica</h2>
      </div>
      <ul>
        <Link to={'/'} className="custom-button">
          <li>
            <img src={homeIcon} /> Início 
          </li>
        </Link>
        
        <li className="menu-item" onClick={() => setReservasOpen(!reservasOpen)}>
          <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
            <img src={roomIcon} /> Reservas
            <span className={`arrow ${reservasOpen ? 'expanded' : ''}`}>▼</span>
          </div>
        </li>
        
        {reservasOpen && (
          <div className="submenu">
            <Link to={'/Reservas'} className="custom-button">
              <li className="submenu-item">
                <img src={analysisIcon} /> Análise de Reservas
              </li>
            </Link>
            <Link to={'/ReservasMarcadas'} className="custom-button">
              <li className="submenu-item">
                <img src={equipmentIcon} /> Reservas Marcadas
              </li>
            </Link>
            <Link to={'/ReservasRealizadas'} className="custom-button">
              <li className="submenu-item">
                <img src={adminIcon} /> Reservas Realizadas
              </li>
            </Link>
          </div>
        )}
        
        <Link to={'/Recursos'} className="custom-button">
          <li>
            <img src={equipmentIcon} /> Recursos
          </li>
        </Link>
        
        <Link to={'/Suporte'} className="custom-button">
          <li>
            <img src={statusIcon} /> Suporte
          </li>
        </Link>
        
        {isAdmin && (
          <>
            <Link to={'/Gerenciador'} className="custom-button">
              <li>
                <img src={analysisIcon} /> Gerenciadores
              </li>
            </Link>
            <Link to={'/Alunos'} className="custom-button">
              <li>
                <img src={supportIcon} /> Alunos
              </li>
            </Link>
          </>
        )}
        
        <li onClick={handleLogout} className="custom-button logout-button" style={{cursor: 'pointer', color: '#ff4444'}}>
          <img src={ExternalLink} alt="Sair" /> Sair
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
