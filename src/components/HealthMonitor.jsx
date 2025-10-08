import React, { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

const HealthMonitor = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
    // Verifica a saúde da API a cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const healthData = await healthCheck();
      setHealth(healthData);
    } catch (error) {
      setHealth({ status: 'DOWN', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px',
      borderRadius: '8px',
      backgroundColor: health?.status === 'UP' ? '#4CAF50' : '#f44336',
      color: 'white',
      fontSize: '12px',
      zIndex: 1000
    }}>
      API: {health?.status || 'DOWN'}
    </div>
  );
};

export default HealthMonitor;