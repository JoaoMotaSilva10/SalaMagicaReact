import React, { useState, useEffect } from 'react';
import { getTodasReservas, confirmarRealizacao, atualizarReserva, getTodosRecursos } from '../services/api';
import '../AnaliseReservas/ReservasCards.css';

export function MainReservasMarcadas() {
  const [reservas, setReservas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [formData, setFormData] = useState({
    informacao: '',
    dataReservada: '',
    statusReserva: 'ACEITA',
    recurso: { id: '' }
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [reservasData, recursosData] = await Promise.all([
        getTodasReservas(),
        getTodosRecursos()
      ]);
      const aceitas = reservasData.filter(r => r.statusReserva === 'ACEITA');
      setReservas(aceitas);
      setRecursos(recursosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (id) => {
    try {
      await confirmarRealizacao(id);
      carregarDados();
    } catch (err) {
      console.error('Erro ao confirmar realização:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservaAtualizada = {
        informacao: formData.informacao,
        dataReservada: formData.dataReservada,
        statusReserva: formData.statusReserva,
        pessoaId: editingReserva.pessoa?.id,
        recurso: { id: parseInt(formData.recurso.id) }
      };
      
      await atualizarReserva(editingReserva.id, reservaAtualizada);
      await carregarDados();
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
    }
  };

  const handleEdit = (reserva) => {
    setEditingReserva(reserva);
    
    let dataFormatada = '';
    if (reserva.dataReservada) {
      try {
        const date = new Date(reserva.dataReservada);
        if (!isNaN(date.getTime())) {
          dataFormatada = date.toISOString().substring(0, 16);
        }
      } catch (error) {
        console.error('Erro ao formatar data:', error);
      }
    }
    
    setFormData({
      informacao: reserva.informacao || '',
      dataReservada: dataFormatada,
      statusReserva: reserva.statusReserva,
      recurso: { id: reserva.recurso?.id || '' }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      informacao: '',
      dataReservada: '',
      statusReserva: 'ACEITA',
      recurso: { id: '' }
    });
    setEditingReserva(null);
    setShowModal(false);
  };

  if (loading) return <div className="loading">Carregando reservas marcadas...</div>;

  return (
    <div className="reservas-container">
      <div className="reservas-header">
        <h1>Reservas Marcadas</h1>
      </div>

      {reservas.length === 0 ? (
        <p className="sem-reservas">Nenhuma reserva marcada.</p>
      ) : (
        <div className="reservas-grid">
          {reservas.map(reserva => {
            const dataReserva = new Date(reserva.dataReservada);
            const agora = new Date();
            const podeConfirmar = dataReserva < agora;
            return (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-header">
                  <h3>#{reserva.id}</h3>
                  <span className="status aceita">ACEITA</span>
                </div>
                <p className="reserva-tipo"><strong>Usuário:</strong> {reserva.pessoa?.nome}</p>
                <p><strong>Recurso:</strong> {reserva.recurso?.nome}</p>
                <p className="reserva-descricao"><strong>Data:</strong> {dataReserva.toLocaleString()}</p>
                <p className="reserva-descricao">{reserva.informacao}</p>
                <div className="reserva-actions">
                  {podeConfirmar && (
                    <button className="btn-confirmar" onClick={() => handleConfirmar(reserva.id)}>
                      Confirmar Realização
                    </button>
                  )}
                  <button className="btn-edit" onClick={() => handleEdit(reserva)}>Editar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Editar Reserva #{editingReserva?.id}</h2>
              <button className="btn-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Recurso:</label>
                <select
                  value={formData.recurso.id}
                  onChange={(e) => setFormData({...formData, recurso: { id: e.target.value }})}
                  required
                >
                  <option value="">Selecione o recurso</option>
                  {recursos.map(recurso => (
                    <option key={recurso.id} value={recurso.id}>
                      {recurso.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Data e Hora:</label>
                <input
                  type="datetime-local"
                  value={formData.dataReservada}
                  onChange={(e) => setFormData({...formData, dataReservada: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Informação:</label>
                <textarea
                  value={formData.informacao}
                  onChange={(e) => setFormData({...formData, informacao: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.statusReserva}
                  onChange={(e) => setFormData({...formData, statusReserva: e.target.value})}
                >
                  <option value="ACEITA">Aceita</option>
                  <option value="REALIZADA">Realizada</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm}>Cancelar</button>
                <button type="submit">Atualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
