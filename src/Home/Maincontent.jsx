import React from 'react';
import './MainContent.css';
import { Link } from 'react-router-dom';
import { useEstatisticas } from '../hooks/useEstatisticas';
import { useAuth } from '../contexts/AuthContext';

function MainContent() {
  const { estatisticas, loading, error, refetch } = useEstatisticas(true, 30000);
  const { user } = useAuth();

  return (
    <div className="main-content">
      <div className="top-bar">
        <h1 className="titulo">
          Bem-vindo(a), {user?.nome || "Gerente"}!
        </h1>
        <button 
          onClick={refetch} 
          disabled={loading}
          className="refresh-button"
          title="Atualizar estatísticas"
        >
          {loading ? '🔄' : '↻'} Atualizar
        </button>
      </div>

      <div className="estatisticas-grid">
        <div className="estatistica-card">
          <h2>Total de Reservas</h2>
          <p>{loading ? '...' : (estatisticas?.totalReservas || 0)}</p>
        </div>

        <div className="estatistica-card">
          <h2>Reservas Hoje</h2>
          <p>{loading ? '...' : (estatisticas?.reservasHoje || 0)}</p>
        </div>

        <div className="estatistica-card">
          <h2>Reservas Pendentes</h2>
          <p>{loading ? '...' : (estatisticas?.reservasPendentes || 0)}</p>
          <Link to="/Reservas" className="card-button">Ver Pendentes</Link>
        </div>

        <div className="estatistica-card">
          <h2>Reservas Marcadas</h2>
          <p>{loading ? '...' : (estatisticas?.reservasMarcadas || 0)}</p>
          <Link to="/ReservasMarcadas" className="card-button">Ver Marcadas</Link>
        </div>

        <div className="estatistica-card">
          <h2>Reservas Realizadas</h2>
          <p>{loading ? '...' : (estatisticas?.reservasRealizadas || 0)}</p>
          <Link to="/ReservasRealizadas" className="card-button">Ver Realizadas</Link>
        </div>
      </div>

    </div>
  );
}

export default MainContent;
