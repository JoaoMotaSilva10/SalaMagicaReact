import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logobranca.svg';
import LoginImage from '../assets/image.svg';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/usuarios/login', {
        email,
        senha
      });

      const usuario = response.data;

      localStorage.setItem('usuario', JSON.stringify(usuario));
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('E-mail ou senha inválidos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={LoginImage} alt="Login" className="login-bg-image" />
      </div>

      <div className="login-form">
        <div className="login-header">
          <img src={Logo} className="Logo" />
          <h1 className="sala">Sala Mágica</h1>
          <p>É ótimo te ver novamente!</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite o e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="options">
            <a href="/esqueci-senha" className="forgot-password">Esqueceu a senha?</a>
            <div className="remember">
              <label className="switch">
                <input type="checkbox" id="remember" />
                <span className="slider"></span>
              </label>
              <label htmlFor="remember" className="lembrlog">Lembrar login</label>
            </div>
          </div>

          {erro && <p className="erro-login">{erro}</p>}

          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
