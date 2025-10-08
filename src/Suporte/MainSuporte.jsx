import React, { useState, useEffect } from 'react';
import { getMensagens, getAlunos, formatarDataExibicao } from '../services/api';
import './MainSuporte.css';

const MainSuporte = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [filteredMensagens, setFilteredMensagens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mensagensData, alunosData] = await Promise.all([
        getMensagens(),
        getAlunos()
      ]);
      const mensagensArray = Array.isArray(mensagensData) ? mensagensData : [];
      setMensagens(mensagensArray);
      setFilteredMensagens(mensagensArray);
      setAlunos(Array.isArray(alunosData) ? alunosData : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setMensagens([]);
      setFilteredMensagens([]);
      setAlunos([]);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredMensagens(mensagens);
    } else {
      const filtered = mensagens.filter(mensagem => 
        mensagem.emissor?.toLowerCase().includes(term.toLowerCase()) ||
        mensagem.email?.toLowerCase().includes(term.toLowerCase()) ||
        mensagem.assunto?.toLowerCase().includes(term.toLowerCase()) ||
        mensagem.texto?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMensagens(filtered);
    }
  };

  const getRMByEmail = (email) => {
    const aluno = alunos.find(a => a.email === email);
    return aluno?.rm || '—';
  };

  const handleToggle = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="suporte-container">
      <div className="suporte-header">
        <h1>Gerenciamento de Suporte</h1>
        <input
          type="text"
          placeholder="Pesquisar por emissor, email, assunto ou texto..."
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
      <div className="table-wrapper">
        <table className="support-table">
          <thead>
            <tr>
              <th>Nome (Emissor)</th>
              <th>RM</th>
              <th>Email</th>
              <th>Assunto</th>
              <th>Data</th>
              <th>Ver Reclamação</th>
            </tr>
          </thead>
          <tbody>
            {filteredMensagens.map(item => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{item.emissor}</td>
                  <td>{item.rm || getRMByEmail(item.email)}</td>
                  <td>{item.email}</td>
                  <td>{item.assunto}</td>
                  <td>{formatarDataExibicao(item.dataMensagem)}</td>
                  <td>
                    <button className="seta" onClick={() => handleToggle(item.id)}>
                      {expandedRow === item.id ? '▲' : '▼'}
                    </button>
                  </td>
                </tr>
                {expandedRow === item.id && (
                  <tr>
                    <td colSpan="6">
                      <div className="reclamacao-details">
                        {item.texto}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filteredMensagens.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                  Nenhuma mensagem encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainSuporte;
