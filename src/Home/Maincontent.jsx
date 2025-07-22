import React, { useEffect, useState } from 'react';
import './MainContent.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const usuario = JSON.parse(localStorage.getItem("usuario"));

function MainContent() {
  const [totalReservas, setTotalReservas] = useState(0);
  const [reservasHoje, setReservasHoje] = useState(0);
  const [reservasPendentes, setReservasPendentes] = useState(0);

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  const fetchEstatisticas = async () => {
    try {
      const total = await axios.get('http://localhost:8080/reservas/count');
      const hoje = await axios.get('http://localhost:8080/reservas/count/today');
      const pendentes = await axios.get('http://localhost:8080/reservas/count/pendentes');

      setTotalReservas(total.data);
      setReservasHoje(hoje.data);
      setReservasPendentes(pendentes.data);
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
        <Link to="/Login" className="btn-sair">Sair da conta</Link>
      </div>

      <div className="estatisticas-grid">
        <div className="estatistica-card">
          <h2>Total de Reservas</h2>
          <p>{totalReservas}</p>
        </div>
        <div className="estatistica-card">
          <h2>Reservas de Hoje</h2>
          <p>{reservasHoje}</p>
        </div>
        <div className="estatistica-card">
          <h2>Reservas Pendentes</h2>
          <p>{reservasPendentes}</p>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
