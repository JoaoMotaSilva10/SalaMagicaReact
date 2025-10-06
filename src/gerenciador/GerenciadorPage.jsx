import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Gerenciador from './gerenciador';

const GerenciadorPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <Gerenciador />
      </div>
    </div>
  );
};

export default GerenciadorPage;