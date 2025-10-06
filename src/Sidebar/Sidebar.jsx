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
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isAdmin = user?.tipoUsuario === 'ADMINISTRADOR';

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo}/>
        <h2>Sala Mágica</h2>
      </div>
      <div className="sidebar-content">
        <ul>
          <Link to={'/'} className="custom-button">
            <li>
              <img src={homeIcon} /> Início 
            </li>
          </Link>
          
          <li className="menu-item" onClick={() => toggleMenu('reservas')}>
            <img src={roomIcon} /> Reservas 
            <span className={`arrow ${expandedMenus.reservas ? 'expanded' : ''}`}>▼</span>
          </li>
          {expandedMenus.reservas && (
            <div className="submenu">
              <Link to={'/Reservas'} className="custom-button">
                <li className="submenu-item">
                  <img src={analysisIcon} /> Análise
                </li>
              </Link>
              <Link to={'/ReservasMarcadas'} className="custom-button">
                <li className="submenu-item">
                  <img src={equipmentIcon} /> Marcadas
                </li>
              </Link>
              <Link to={'/ReservasRealizadas'} className="custom-button">
                <li className="submenu-item">
                  <img src={adminIcon} /> Realizadas
                </li>
              </Link>
              <Link to={'/ReservasGerenciamento'} className="custom-button">
                <li className="submenu-item">
                  <img src={statusIcon} /> Todas
                </li>
              </Link>
            </div>
          )}
          
          <Link to={'/Recursos'} className="custom-button">
            <li>
              <img src={statusIcon} /> Recursos
            </li>
          </Link>
          
          <Link to={'/Suporte'} className="custom-button">
            <li>
              <img src={supportIcon} /> Suporte
            </li>
          </Link>
          
          {isAdmin && (
            <>
              <li className="menu-item" onClick={() => toggleMenu('admin')}>
                <img src={adminIcon} /> Administração 
                <span className={`arrow ${expandedMenus.admin ? 'expanded' : ''}`}>▼</span>
              </li>
              {expandedMenus.admin && (
                <div className="submenu">
                  <Link to={'/Gerenciador'} className="custom-button">
                    <li className="submenu-item">
                      <img src={analysisIcon} /> Gerenciadores
                    </li>
                  </Link>
                  <Link to={'/Alunos'} className="custom-button">
                    <li className="submenu-item">
                      <img src={supportIcon} /> Alunos
                    </li>
                  </Link>
                </div>
              )}
            </>
          )}
        </ul>
        
        <div className="sidebar-footer">
          <ul>
            <li onClick={handleLogout} className="logout-button" style={{cursor: 'pointer'}}>
              <img src={ExternalLink} alt="Sair" /> Sair
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
