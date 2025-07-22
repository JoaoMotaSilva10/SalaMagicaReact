import React from 'react';
import './MainContentGerenciador.css';
import Sidebar from '../Sidebar/Sidebar';
import MainContentGer from './MainContentGerenciador'

const gerenciador = () => {
  return (
    <div className="app-container">
       <Sidebar />
      <MainContentGer />
    </div>
);
};
export default gerenciador