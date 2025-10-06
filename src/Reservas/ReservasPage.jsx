import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ReservasGerenciamento from './ReservasGerenciamento';

const ReservasPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <ReservasGerenciamento />
      </div>
    </div>
  );
};

export default ReservasPage;