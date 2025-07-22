import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { MainReservasMarcadas } from './MainReservasMarcadas'; 

const ReservasMarcadasPage = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <MainReservasMarcadas />
    </div>
  );
};

export default ReservasMarcadasPage;
