  import axios from 'axios';
/* AQUI VAI SER LOCALHOST
    const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
*/
  const api = axios.create({
    baseURL: 'https://unarrested-unreverentially-valeria.ngrok-free.dev',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });

  export const getTodasReservas = async () => {
    const response = await api.get('/reservas');
    return response.data;
  };

  export const getReservaPorId = async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  };

  export const atualizarReserva = async (id, reservaAtualizada) => {
    const response = await api.put(`/reservas/${id}`, reservaAtualizada);
    return response.data;
  };

  // Função para marcar a reserva como realizada
  export const ConfirmarRealizacao = async (reservaId) => {
    // Buscar dados atuais da reserva
    const reservaAtual = await getReservaPorId(reservaId);

    // Atualizar o status para REALIZADA
    const reservaAtualizada = { ...reservaAtual, statusReserva: "REALIZADA" };

    // Enviar update para backend
    return await atualizarReserva(reservaId, reservaAtualizada);
  };

  export const getMensagens = async () => {
    const response = await api.get('/mensagens');
    return response.data;
  };

  // Interceptor para adicionar token nas requisições
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para lidar com respostas
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  export default api;

