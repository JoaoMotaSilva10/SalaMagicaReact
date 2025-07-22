import '../App.css';
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import MainSuporte from './MainSuporte';

function Suporte() {
  return (
    <div className="app-container">
    <Sidebar />
    <MainSuporte />
  </div>
  );
}

export default Suporte;