import React, { useState } from 'react';
import './EsqueciSenha.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logobranca.svg';
import LoginImage from '../assets/image.svg';
import { esqueciSenha, verificarCodigo, redefinirSenha } from '../services/api';

const EsqueciSenha = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1); // 1: email, 2: código, 3: nova senha
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEnviarEmail = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErro('Por favor, digite seu e-mail');
      return;
    }

    setCarregando(true);
    try {
      await esqueciSenha(email);
      setEtapa(2);
      setErro('');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      setErro('E-mail não encontrado ou erro no servidor');
    } finally {
      setCarregando(false);
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    
    if (!codigo) {
      setErro('Por favor, digite o código');
      return;
    }

    setCarregando(true);
    try {
      await verificarCodigo(email, codigo);
      setEtapa(3);
      setErro('');
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      setErro('Código inválido ou expirado');
    } finally {
      setCarregando(false);
    }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    
    if (!novaSenha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);
    try {
      await redefinirSenha(email, codigo, novaSenha);
      
      alert('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setErro('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const voltarLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={LoginImage} alt="Esqueci Senha" className="login-bg-image" />
      </div>

      <div className="login-form">
        <div className="login-header">
          <img src={Logo} className="Logo" alt="Logo" />
          <h1 className="sala">Sala Mágica</h1>
          {etapa === 1 && <p>Digite seu e-mail para recuperar sua senha</p>}
          {etapa === 2 && <p>Digite o código enviado para seu e-mail</p>}
          {etapa === 3 && <p>Defina sua nova senha</p>}
        </div>

        {etapa === 1 && (
          <form onSubmit={handleEnviarEmail}>
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={carregando}
              />
            </div>

            {erro && <p className="erro-login">{erro}</p>}

            <button type="submit" className="login-button" disabled={carregando}>
              {carregando ? 'Enviando...' : 'Enviar Código'}
            </button>

            <button type="button" className="voltar-button" onClick={voltarLogin}>
              Voltar ao Login
            </button>
          </form>
        )}

        {etapa === 2 && (
          <form onSubmit={handleVerificarCodigo}>
            <div className="input-group">
              <label htmlFor="codigo">Código de Verificação</label>
              <input
                type="text"
                id="codigo"
                placeholder="Digite o código recebido por e-mail"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                disabled={carregando}
                maxLength={6}
              />
            </div>

            <div className="info-message">
              <p>📧 Código enviado para: <strong>{email}</strong></p>
              <button 
                type="button" 
                className="link-button" 
                onClick={() => setEtapa(1)}
              >
                Alterar e-mail
              </button>
            </div>

            {erro && <p className="erro-login">{erro}</p>}

            <button type="submit" className="login-button" disabled={carregando}>
              {carregando ? 'Verificando...' : 'Verificar Código'}
            </button>

            <button type="button" className="voltar-button" onClick={voltarLogin}>
              Voltar ao Login
            </button>
          </form>
        )}

        {etapa === 3 && (
          <form onSubmit={handleRedefinirSenha}>
            <div className="input-group">
              <label htmlFor="novaSenha">Nova Senha</label>
              <input
                type="password"
                id="novaSenha"
                placeholder="Digite sua nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={carregando}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Confirme sua nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={carregando}
              />
            </div>

            {erro && <p className="erro-login">{erro}</p>}

            <button type="submit" className="login-button" disabled={carregando}>
              {carregando ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>

            <button type="button" className="voltar-button" onClick={voltarLogin}>
              Voltar ao Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EsqueciSenha;