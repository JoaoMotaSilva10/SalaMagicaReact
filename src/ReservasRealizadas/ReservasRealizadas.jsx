import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { MainReservasRealizadas } from './MainReservasRealizadas'; 

const ReservasRealizadasPage = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <MainReservasRealizadas />
    </div>
  );
};

export default ReservasRealizadasPage;
