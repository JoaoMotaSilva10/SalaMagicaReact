import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Auth API
export const login = async (email, senha) => {
  const response = await api.post('/auth/login', { email, senha });
  return response.data;
};

export const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado');
  }
  const response = await api.get('/auth/validate', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Reservas API
export const getTodasReservas = async () => {
  try {
    const response = await api.get('/reservas');
    return response.data;
  } catch (error) {
    console.error('Erro detalhado:', error.response?.data || error.message);
    throw error;
  }
};

export const getReservaPorId = async (id) => {
  const response = await api.get(`/reservas/${id}`);
  return response.data;
};

export const getReservasPorPessoa = async (pessoaId) => {
  const response = await api.get(`/reservas/pessoa/${pessoaId}`);
  return response.data;
};

export const criarReserva = async (reserva) => {
  const payload = {
    informacao: reserva.informacao || '',
    dataReservada: reserva.dataReservada,
    pessoaId: reserva.pessoa?.id || reserva.pessoaId,
    recurso: { id: parseInt(reserva.recurso.id) },
    statusReserva: reserva.statusReserva || 'EM_ANALISE'
  };
  const response = await api.post('/reservas', payload);
  return response.data;
};

export const atualizarReserva = async (id, reservaAtualizada) => {
  const payload = {
    informacao: reservaAtualizada.informacao || '',
    dataReservada: reservaAtualizada.dataReservada,
    pessoaId: reservaAtualizada.pessoa?.id || reservaAtualizada.pessoaId,
    recurso: { id: parseInt(reservaAtualizada.recurso.id) },
    statusReserva: reservaAtualizada.statusReserva
  };
  const response = await api.put(`/reservas/${id}`, payload);
  return response.data;
};

export const deletarReserva = async (id) => {
  await api.delete(`/reservas/${id}`);
};

export const confirmarRealizacao = async (reservaId) => {
  const response = await api.put(`/reservas/${reservaId}/confirmar`);
  return response.data;
};

// Função legada para compatibilidade
export const ConfirmarRealizacao = confirmarRealizacao;

// Estatísticas Unificadas (NOVO)
export const getEstatisticasCompletas = async () => {
  const response = await api.get('/estatisticas');
  return response.data;
};

// Estatísticas de Reservas (Mantido para compatibilidade)
export const getEstatisticasReservas = async () => {
  try {
    // Tenta usar o novo endpoint primeiro
    const stats = await getEstatisticasCompletas();
    return {
      total: stats.totalReservas,
      hoje: stats.reservasHoje,
      pendentes: stats.reservasPendentes,
      marcadas: stats.reservasMarcadas,
      realizadas: stats.reservasRealizadas
    };
  } catch (error) {
    // Fallback para endpoints individuais
    const [total, hoje, pendentes, marcadas, realizadas] = await Promise.all([
      api.get('/reservas/count'),
      api.get('/reservas/count/today'),
      api.get('/reservas/count/pendentes'),
      api.get('/reservas/count/marcadas'),
      api.get('/reservas/count/realizadas')
    ]);
    
    return {
      total: total.data,
      hoje: hoje.data,
      pendentes: pendentes.data,
      marcadas: marcadas.data,
      realizadas: realizadas.data
    };
  }
};

// Recursos API
export const getTodosRecursos = async () => {
  const response = await api.get('/recursos');
  return response.data;
};

export const getRecursoPorId = async (id) => {
  const response = await api.get(`/recursos/${id}`);
  return response.data;
};

export const criarRecurso = async (recurso) => {
  const response = await api.post('/recursos', recurso);
  return response.data;
};

export const atualizarRecurso = async (id, recurso) => {
  const response = await api.put(`/recursos/${id}`, recurso);
  return response.data;
};

export const deletarRecurso = async (id) => {
  await api.delete(`/recursos/${id}`);
};

// Alunos API
export const getAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};

export const getAlunoPorEmail = async (email) => {
  const response = await api.get(`/alunos/perfil?email=${email}`);
  return response.data;
};

export const criarAluno = async (aluno) => {
  const response = await api.post('/alunos', aluno);
  return response.data;
};

export const atualizarAluno = async (id, aluno) => {
  const response = await api.put(`/alunos/${id}`, aluno);
  return response.data;
};

export const deletarAluno = async (id) => {
  await api.delete(`/alunos/${id}`);
};

// Recuperação de senha - Alunos
export const esqueciSenhaAluno = async (email) => {
  const response = await api.post('/alunos/esqueci-senha', { email });
  return response.data;
};

export const verificarCodigoAluno = async (email, codigo) => {
  const response = await api.post('/alunos/verificar-codigo', { email, codigo });
  return response.data;
};

export const redefinirSenhaAluno = async (email, codigo, novaSenha) => {
  const response = await api.post('/alunos/redefinir-senha', { email, codigo, novaSenha });
  return response.data;
};

// Funções legadas para compatibilidade
export const esqueciSenha = esqueciSenhaAluno;
export const verificarCodigo = verificarCodigoAluno;
export const redefinirSenha = redefinirSenhaAluno;

// Gerenciadores API
export const getGerenciadores = async () => {
  const response = await api.get('/gerenciadores');
  return response.data;
};

export const criarGerenciador = async (gerenciador) => {
  const response = await api.post('/gerenciadores', gerenciador);
  return response.data;
};

export const atualizarGerenciador = async (id, gerenciador) => {
  const response = await api.put(`/gerenciadores/${id}`, gerenciador);
  return response.data;
};

export const getGerenciadorPorId = async (id) => {
  const response = await api.get(`/gerenciadores/${id}`);
  return response.data;
};

export const deletarGerenciador = async (id) => {
  await api.delete(`/gerenciadores/${id}`);
};

// Recuperação de senha - Gerenciadores
export const esqueciSenhaGerenciador = async (email) => {
  const response = await api.post('/gerenciadores/esqueci-senha', { email });
  return response.data;
};

// Administradores API (ATUALIZADO)
export const getAdministradores = async () => {
  const response = await api.get('/administradores');
  return response.data;
};

export const getAdministradorPorId = async (id) => {
  const response = await api.get(`/administradores/${id}`);
  return response.data;
};

export const criarAdministrador = async (administrador) => {
  const response = await api.post('/administradores', administrador);
  return response.data;
};

export const atualizarAdministrador = async (id, administrador) => {
  const response = await api.put(`/administradores/${id}`, administrador);
  return response.data;
};

export const deletarAdministrador = async (id) => {
  await api.delete(`/administradores/${id}`);
};

// Recuperação de senha - Administradores
export const esqueciSenhaAdministrador = async (email) => {
  const response = await api.post('/administradores/esqueci-senha', { email });
  return response.data;
};

// Mensagens API
export const getMensagens = async () => {
  const response = await api.get('/mensagens');
  return response.data;
};

export const criarMensagem = async (mensagem) => {
  const response = await api.post('/mensagens', mensagem);
  return response.data;
};

export const atualizarMensagem = async (id, mensagem) => {
  const response = await api.put(`/mensagens/${id}`, mensagem);
  return response.data;
};

export const deletarMensagem = async (id) => {
  await api.delete(`/mensagens/${id}`);
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

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Utilitários de Data
export const formatarData = (data) => {
  if (!data) return '';
  
  try {
    let date;
    
    // Se for array de números [ano, mês, dia, hora, minuto, segundo, nano]
    if (Array.isArray(data)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = data;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(data);
    }
    
    if (isNaN(date.getTime())) return '';
    
    // Ajustar para timezone local antes de formatar
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    
    // Formato para input datetime-local: YYYY-MM-DDTHH:MM
    return localDate.toISOString().substring(0, 16);
  } catch (error) {
    console.warn('Erro ao formatar data:', data, error);
    return '';
  }
};

export const formatarDataExibicao = (data) => {
  if (!data) return 'N/A';
  
  try {
    let date;
    
    // Se for array de números [ano, mês, dia, hora, minuto, segundo, nano]
    if (Array.isArray(data)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = data;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(data);
    }
    
    if (isNaN(date.getTime())) return 'Data inválida';
    
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.warn('Erro ao formatar data para exibição:', data, error);
    return 'Data inválida';
  }
};

export default api;

