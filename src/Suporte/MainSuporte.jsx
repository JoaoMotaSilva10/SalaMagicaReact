import React, { useState, useEffect } from 'react';
import { getMensagens, getAlunos } from '../services/api';
import './MainSuporte.css';

const MainSuporte = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [mensagens, setMensagens] = useState([]);
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
      setMensagens(Array.isArray(mensagensData) ? mensagensData : []);
      setAlunos(Array.isArray(alunosData) ? alunosData : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setMensagens([]);
      setAlunos([]);
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
    <div className="main-content">
      <div className="header">
        <h1 className="cadastrareq">Hora de visualizar as reclamações!</h1>
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
            {mensagens.map(item => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{item.emissor}</td>
                  <td>{item.rm || getRMByEmail(item.email)}</td>
                  <td>{item.email}</td>
                  <td>{item.assunto}</td>
                  <td>{new Date(item.dataMensagem).toLocaleDateString('pt-BR')}</td>
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
            {mensagens.length === 0 && (
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
