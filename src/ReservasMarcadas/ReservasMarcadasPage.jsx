import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { MainReservasMarcadas } from './MainReservasMarcadas';

const ReservasMarcadasPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <MainReservasMarcadas />
      </div>
    </div>
  );
};

export default ReservasMarcadasPage;