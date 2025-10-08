import { useState, useEffect } from 'react';
import { getEstatisticasCompletas } from '../services/api';

export const useEstatisticas = (autoRefresh = false, interval = 60000) => {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEstatisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEstatisticasCompletas();
      setEstatisticas(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstatisticas();

    if (autoRefresh) {
      const intervalId = setInterval(fetchEstatisticas, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, interval]);

  return {
    estatisticas,
    loading,
    error,
    refetch: fetchEstatisticas
  };
};