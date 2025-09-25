import axios from 'axios';

const api = axios.create({
  baseURL: 'https://unarrested-unreverentially-valeria.ngrok-free.dev',
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

