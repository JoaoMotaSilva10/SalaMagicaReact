import React, { useState, useEffect } from 'react';
import { getTodosRecursos, criarRecurso, atualizarRecurso, deletarRecurso } from '../services/api';
import './Recursos.css';

const Recursos = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    statusRecurso: 'DISPONIVEL'
  });

  useEffect(() => {
    carregarRecursos();
  }, []);

  const carregarRecursos = async () => {
    try {
      const data = await getTodosRecursos();
      setRecursos(data);
    } catch (error) {
      console.error('Erro ao carregar recursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecurso) {
        await atualizarRecurso(editingRecurso.id, formData);
      } else {
        await criarRecurso(formData);
      }
      await carregarRecursos();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar recurso:', error);
    }
  };

  const handleEdit = (recurso) => {
    setEditingRecurso(recurso);
    setFormData({
      nome: recurso.nome,
      descricao: recurso.descricao,
      tipo: recurso.tipo,
      statusRecurso: recurso.statusRecurso
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso?')) {
      try {
        await deletarRecurso(id);
        await carregarRecursos();
      } catch (error) {
        console.error('Erro ao excluir recurso:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      tipo: '',
      statusRecurso: 'DISPONIVEL'
    });
    setEditingRecurso(null);
    setShowModal(false);
  };

  if (loading) return <div className="loading">Carregando recursos...</div>;

  return (
    <div className="recursos-container">
      <div className="recursos-header">
        <h1>Gerenciamento de Recursos</h1>
        <button 
          className="btn-novo-recurso"
          onClick={() => setShowModal(true)}
        >
          Novo Recurso
        </button>
      </div>

      <div className="recursos-grid">
        {recursos.map(recurso => (
          <div key={recurso.id} className="recurso-card">
            <div className="recurso-header">
              <h3>{recurso.nome}</h3>
              <span className={`status ${recurso.statusRecurso.toLowerCase()}`}>
                {recurso.statusRecurso}
              </span>
            </div>
            <p className="recurso-tipo">{recurso.tipo}</p>
            <p className="recurso-descricao">{recurso.descricao}</p>
            <div className="recurso-actions">
              <button 
                className="btn-edit"
                onClick={() => handleEdit(recurso)}
              >
                Editar
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(recurso.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingRecurso ? 'Editar Recurso' : 'Novo Recurso'}</h2>
              <button className="btn-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="SALA">Sala</option>
                  <option value="EQUIPAMENTO">Equipamento</option>
                  <option value="LABORATORIO">Laboratório</option>
                </select>
              </div>
              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.statusRecurso}
                  onChange={(e) => setFormData({...formData, statusRecurso: e.target.value})}
                >
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="MANUTENCAO">Manutenção</option>
                  <option value="INDISPONIVEL">Indisponível</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm}>Cancelar</button>
                <button type="submit">
                  {editingRecurso ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recursos;