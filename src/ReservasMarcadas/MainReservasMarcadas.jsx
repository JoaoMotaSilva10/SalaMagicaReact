import React, { useState, useEffect } from 'react';
import { getTodasReservas, ConfirmarRealizacao } from '../services/api';
import '../AnaliseReservas/Reservas.css';

export function MainReservasMarcadas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = () => {
    getTodasReservas()
      .then(data => {
        const aceitas = data.filter(r => r.statusReserva === 'ACEITA');
        setReservas(aceitas);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleConfirmar = async (id) => {
    try {
      await ConfirmarRealizacao(id);
      fetchReservas();
    } catch (err) {
      console.error('Erro ao confirmar realização:', err);
    }
  };

  return loading ? (
    <p>Carregando reservas marcadas...</p>
  ) : (
    <div className="container-reservas">
      <h1 className="titulo-reservas">Hora de Visualizar</h1>
      <h1 className="titulo-reservas2">as Reservas Marcadas!</h1>
      {reservas.length === 0 ? (
        <p className="sem-reservas">Nenhuma reserva marcada.</p>
      ) : (
        <div className="lista-reservas">
          {reservas.map(r => {
            const dataReserva = new Date(r.dataReservada);
            const agora = new Date();
            const podeConfirmar = dataReserva < agora;
            return (
              <div key={r.id} className="card-reserva">
                <p><strong>ID:</strong> {r.id}</p>
                <p><strong>Usuário:</strong> {r.usuario.nome}</p>
                <p><strong>Recurso:</strong> {r.recurso.nome}</p>
                <p><strong>Data:</strong> {dataReserva.toLocaleDateString()}</p>
                <p><strong>Status:</strong> {r.statusReserva}</p>
                {podeConfirmar && (
                  <button
                    className="btn confirmar"
                    onClick={() => handleConfirmar(r.id)}
                  >
                    Confirmar Realização
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
