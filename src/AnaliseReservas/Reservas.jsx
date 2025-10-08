import React, { useEffect, useState } from 'react';
import { getTodasReservas, atualizarReserva, getTodosRecursos, formatarData, formatarDataExibicao } from '../services/api';
import './ReservasCards.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [formData, setFormData] = useState({
    informacao: '',
    dataReservada: '',
    statusReserva: 'EM_ANALISE',
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
      const pendentes = reservasData.filter(r => r.statusReserva === 'EM_ANALISE');
      setReservas(pendentes);
      setFilteredReservas(pendentes);
      setRecursos(recursosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredReservas(reservas);
    } else {
      const filtered = reservas.filter(reserva => 
        reserva.pessoaNome?.toLowerCase().includes(term.toLowerCase()) ||
        reserva.recurso?.nome?.toLowerCase().includes(term.toLowerCase()) ||
        reserva.informacao?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredReservas(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservaAtualizada = {
        informacao: formData.informacao,
        dataReservada: formData.dataReservada,
        statusReserva: formData.statusReserva,
        pessoaId: editingReserva.pessoaId || editingReserva.pessoa?.id,
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
    
    setFormData({
      informacao: reserva.informacao || '',
      dataReservada: formatarData(reserva.dataReservada),
      statusReserva: reserva.statusReserva,
      recurso: { id: reserva.recurso?.id || '' }
    });
    setShowModal(true);
  };

  const handleAtualizarStatus = async (reserva, novoStatus) => {
    try {
      const atualizada = { ...reserva, statusReserva: novoStatus };
      await atualizarReserva(reserva.id, atualizada);
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      informacao: '',
      dataReservada: '',
      statusReserva: 'EM_ANALISE',
      recurso: { id: '' }
    });
    setEditingReserva(null);
    setShowModal(false);
  };

  if (loading) return <div className="loading">Carregando reservas...</div>;

  return (
    <div className="reservas-container">
      <div className="reservas-header">
        <h1>Análise de Reservas</h1>
        <input
          type="text"
          placeholder="Pesquisar por usuário, recurso ou informação..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#0a0a0a',
            color: '#fff',
            minWidth: '300px'
          }}
        />
      </div>

      {filteredReservas.length === 0 ? (
        <p className="sem-reservas">{searchTerm ? 'Nenhuma reserva encontrada.' : 'Nenhuma reserva pendente.'}</p>
      ) : (
        <div className="reservas-grid">
          {filteredReservas.map(reserva => (
            <div key={reserva.id} className="reserva-card">
              <div className="reserva-header">
                <h3>#{reserva.id}</h3>
                <span className="status pendente">EM ANÁLISE</span>
              </div>
              <p className="reserva-tipo"><strong>Usuário:</strong> {reserva.pessoaNome || 'N/A'}</p>
              <p><strong>Recurso:</strong> {reserva.recurso?.nome}</p>
              <p className="reserva-descricao"><strong>Data:</strong> {formatarDataExibicao(reserva.dataReservada)}</p>
              <p className="reserva-descricao">{reserva.informacao}</p>
              <div className="reserva-actions">
                <button className="btn-aceitar" onClick={() => handleAtualizarStatus(reserva, 'ACEITA')}>Aceitar</button>
                <button className="btn-recusar" onClick={() => handleAtualizarStatus(reserva, 'RECUSADA')}>Recusar</button>
                <button className="btn-edit" onClick={() => handleEdit(reserva)}>Editar</button>
              </div>
            </div>
          ))}
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
                  <option value="EM_ANALISE">Em Análise</option>
                  <option value="ACEITA">Aceita</option>
                  <option value="RECUSADA">Recusada</option>
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
};

export default Reservas;
