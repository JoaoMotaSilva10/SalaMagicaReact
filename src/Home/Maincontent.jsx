import React, { useEffect, useState } from 'react';
import './MainContent.css';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
      const total = await api.get('/reservas/count/realizadas');
      const hoje = await api.get('/reservas/count/today');
      const pendentes = await api.get('/reservas/count/pendentes');
      const marcadas = await api.get('/reservas/count/marcadas');
      
      // Buscar todas as reservas para contar pendentes corretamente
      const todasReservas = await api.get('/reservas');
      const reservasPendentesCorretas = todasReservas.data.filter(r => r.statusReserva === 'EM_ANALISE').length;

      console.log('Pendentes da API:', pendentes.data);
      console.log('Pendentes filtradas:', reservasPendentesCorretas);

      setTotalReservas(total.data);
      setReservasHoje(hoje.data);
      setReservasPendentes(reservasPendentesCorretas); // Usando a contagem filtrada
      setReservasMarcadas(marcadas.data);
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
    <Link to="/reservasMarcadas" className="card-button">Ver Marcadas</Link>
  </div>

  <div className="estatistica-card">
    <h2>Reservas Realizadas</h2>
    <p>{totalReservas}</p>
    <Link to="/reservasrealizadas" className="card-button">Ver Realizadas</Link>
  </div>
</div>

    </div>
  );
}

export default MainContent;
