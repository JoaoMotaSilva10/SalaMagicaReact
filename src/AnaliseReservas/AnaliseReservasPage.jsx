import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Reservas from './Reservas';

const AnaliseReservasPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <Reservas />
      </div>
    </div>
  );
};

export default AnaliseReservasPage;