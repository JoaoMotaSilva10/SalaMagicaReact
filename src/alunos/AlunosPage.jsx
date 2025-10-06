import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Alunos from './alunos';

const AlunosPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <Alunos />
      </div>
    </div>
  );
};

export default AlunosPage;