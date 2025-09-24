import React, { useState, useEffect } from 'react';
import { getTodasReservas } from '../services/api'; 
import '../AnaliseReservas/Reservas.css'; // CSS compartilhado

export function MainReservasRealizadas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodasReservas()
      .then(data => {
        const realizadas = data.filter(r => r.statusReserva === 'REALIZADA');
        setReservas(realizadas);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <p>Carregando reservas realizadas...</p>
  ) : (
    <div className="container-reservas">
      <h1 className="titulo-reservas">Hora de Visualizar</h1>
      <h1 className="titulo-reservas2">as Reservas Realizadas!</h1>
      {reservas.length === 0 ? (
        <p className="sem-reservas">Nenhuma reserva realizada.</p>
      ) : (
        <div className="lista-reservas">
          {reservas.map(r => (
            <div key={r.id} className="card-reserva">
              <p><strong>ID:</strong> {r.id}</p>
              <p><strong>Usuário:</strong> {r.usuario.nome}</p>
              <p><strong>Recurso:</strong> {r.recurso.nome}</p>
              <p><strong>Data:</strong> {new Date(r.dataReservada).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {r.statusReserva}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
