import React from 'react';
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
      <Link to={'/'} className="custom-button"> <li>
      <img src={homeIcon} /> <i className="icon-home"></i> Início 
        </li></Link>
        <Link to={'/Reservas'} className="custom-button"> <li>
         <img src={roomIcon}></img> <i className="icon-reservas"></i> Análise de Reservas 
        </li></Link>
        <Link to={'/ReservasMarcadas'} className="custom-button">   <li>
        <img src={equipmentIcon}></img> <i className="icon-salas"></i> Reservas Marcadas
        </li></Link>
        <Link to={'/ReservasRealizadas'} className="custom-button"> <li>
        <img src={adminIcon}></img>  <i className="icon-admin"></i> Reservas Realizadas
        </li></Link>
        <Link to={'/Suporte'} className="custom-button"><li>
        <img src={statusIcon}></img>  <i className="icon-suporte"></i> Suporte
        </li></Link>
        {isAdmin && (
          <>
            <Link to={'/Gerenciador'} className="custom-button"><li>
            <img src={analysisIcon}></img>  <i className="icon-suporte"></i> Gerenciadores
            </li></Link>
            <Link to={'/Alunos'} className="custom-button"><li>
            <img src={supportIcon}></img>  <i className="icon-suporte"></i> Alunos
            </li></Link>
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
