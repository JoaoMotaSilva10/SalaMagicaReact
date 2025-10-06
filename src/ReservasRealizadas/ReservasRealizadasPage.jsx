import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { MainReservasRealizadas } from './MainReservasRealizadas';

const ReservasRealizadasPage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <MainReservasRealizadas />
      </div>
    </div>
  );
};

export default ReservasRealizadasPage;