import React, { useState, useEffect } from 'react';
import { getMensagens } from '../services/api'; // ajuste o caminho conforme seu projeto
import './MainSuporte.css';

const MainSuporte = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    fetchMensagens();
  }, []);

  const fetchMensagens = async () => {
    try {
      const data = await getMensagens();
      setMensagens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setMensagens([]); // Garante array mesmo em erro
    }
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
              <th>Status da Mensagem</th>
              <th>Ver Reclamação</th>
            </tr>
          </thead>
          <tbody>
            {mensagens.map(item => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{item.emissor}</td>
                  <td>—</td> {/* Você pode adaptar se tiver RM */}
                  <td>{item.email}</td>
                  <td>{item.statusMensagem}</td>
                  <td>
                    <button className="seta" onClick={() => handleToggle(item.id)}>
                      {expandedRow === item.id ? '▲' : '▼'}
                    </button>
                  </td>
                </tr>
                {expandedRow === item.id && (
                  <tr>
                    <td colSpan="5">
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
