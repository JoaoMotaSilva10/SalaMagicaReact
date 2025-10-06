import React, { useEffect, useState } from 'react';
import './MainContent.css';
import { Link } from 'react-router-dom';
import { getEstatisticasReservas } from '../services/api';

const usuario = JSON.parse(localStorage.getItem("usuario"));

function MainContent() {
  const [totalReservas, setTotalReservas] = useState(0);
  const [reservasHoje, setReservasHoje] = useState(0);
  const [reservasPendentes, setReservasPendentes] = useState(0);
  const [reservasMarcadas, setReservasMarcadas] = useState(0);

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  const fetchEstatisticas = async () => {
    try {
      const stats = await getEstatisticasReservas();
      
      setTotalReservas(stats.realizadas);
      setReservasHoje(stats.hoje);
      setReservasPendentes(stats.pendentes);
      setReservasMarcadas(stats.marcadas);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  return (
    <div className="main-content">
      <div className="top-bar">
        <h1 className="titulo">
          Bem-vindo(a), {usuario?.nome || "Gerente"}!
        </h1>
      </div>

      <div className="estatisticas-grid">
  <div className="estatistica-card">
    <h2>Reservas Hoje</h2>
    <p>{reservasHoje}</p>
  </div>

  <div className="estatistica-card">
    <h2>Reservas Pendentes</h2>
    <p>{reservasPendentes}</p>
    <Link to="/Reservas" className="card-button">Ver Pendentes</Link>
  </div>

  <div className="estatistica-card">
    <h2>Reservas Marcadas</h2>
    <p>{reservasMarcadas}</p>
    <Link to="/ReservasMarcadas" className="card-button">Ver Marcadas</Link>
  </div>

  <div className="estatistica-card">
    <h2>Reservas Realizadas</h2>
    <p>{totalReservas}</p>
    <Link to="/ReservasRealizadas" className="card-button">Ver Realizadas</Link>
  </div>
</div>

    </div>
  );
}

export default MainContent;
