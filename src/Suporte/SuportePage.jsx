import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Suporte from './Suporte';

const SuportePage = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '300px', minHeight: '100vh' }}>
        <Suporte />
      </div>
    </div>
  );
};

export default SuportePage;