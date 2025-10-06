import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Recursos from './Recursos';

const RecursosPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <Recursos />
      </div>
    </div>
  );
};

export default RecursosPage;