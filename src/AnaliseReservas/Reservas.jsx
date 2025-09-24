import React, { useEffect, useState } from 'react';
import { getTodasReservas, atualizarReserva } from '../services/api';
import './Reservas.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoHorario, setNovoHorario] = useState('');

  const carregarReservas = async () => {
    try {
      const dados = await getTodasReservas();
      const pendentes = dados.filter(r => r.statusReserva === 'EM_ANALISE');
      setReservas(pendentes);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const handleAtualizarStatus = async (reserva, novoStatus) => {
    try {
      const atualizada = { ...reserva, statusReserva: novoStatus };
      await atualizarReserva(reserva.id, atualizada);
      carregarReservas();
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
    }
  };

  const handleSalvarHorario = async (reserva) => {
    try {
      const atualizada = { ...reserva, dataReservada: novoHorario };
      await atualizarReserva(reserva.id, atualizada);
      setEditandoId(null);
      setNovoHorario('');
      carregarReservas();
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
    }
  };

  return (
    <div className="container-reservas">
      <h1 className="titulo-reservas">Hora de Analisar</h1>
      <h1 className="titulo-reservas2">as Reservas!</h1>

      {reservas.length === 0 ? (
        <p className="sem-reservas">Nenhuma reserva pendente.</p>
      ) : (
        <div className="lista-reservas">
          {reservas.map(reserva => (
            <div key={reserva.id} className="card-reserva">
              <p><strong>Usuário:</strong> {reserva.usuario?.nome}</p>
              <p><strong>Recurso:</strong> {reserva.recurso?.nome}</p>

              {editandoId === reserva.id ? (
                <>
                  <label>Nova Data e Hora:</label>
                  <input
                    type="datetime-local"
                    value={novoHorario}
                    onChange={(e) => setNovoHorario(e.target.value)}
                  />
                  <button className="btn salvar" onClick={() => handleSalvarHorario(reserva)}>Salvar</button>
                </>
              ) : (
                <p>
                  <strong>Data reservada:</strong>{' '}
                  {reserva.dataReservada?.replace('T', ' ').substring(0, 16)}
                </p>
              )}

              <p><strong>Status:</strong> {reserva.statusReserva}</p>

              <div className="botoes-reserva">
                <button className="btn aceitar" onClick={() => handleAtualizarStatus(reserva, 'ACEITA')}>
                  Aceitar
                </button>
                <button className="btn recusar" onClick={() => handleAtualizarStatus(reserva, 'RECUSADA')}>
                  Recusar
                </button>
                <button className="btn editar" onClick={() => {
                  setEditandoId(reserva.id);
                  setNovoHorario(reserva.dataReservada?.substring(0, 16));
                }}>
                  Editar horário
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservas;
