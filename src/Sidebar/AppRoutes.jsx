import React from "react";
import Home from "../Home/Home";
import Login from "../Login/Login";
import EsqueciSenha from "../EsqueciSenha/EsqueciSenha";
import Reservas from "../AnaliseReservas/AnaliseReservas";
import Suporte from "../Suporte/Suporte";
import ReservasMarcadasPage from '../ReservasMarcadas/ReservasMarcadas';
import Gerenciador from "../gerenciador/gerenciador";
import Alunos from "../alunos/alunos";
import ReservasRealizadasPage from "../ReservasRealizadas/ReservasRealizadas";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Verifica se há um usuário logado
const isAuthenticated = () => {
  return localStorage.getItem("usuario") !== null;
};

// Rota protegida: se estiver logado, renderiza o componente; senão, redireciona para login
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Login e recuperação de senha sempre acessíveis */}
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        {/* Redirecionar root "/" para login se não estiver logado */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/Reservas" element={<PrivateRoute element={<Reservas />} />} />
        <Route path="/ReservasMarcadas" element={<PrivateRoute element={<ReservasMarcadasPage />} />} />
        <Route path="/ReservasRealizadas" element={<PrivateRoute element={<ReservasRealizadasPage />} />} />
        <Route path="/Suporte" element={<PrivateRoute element={<Suporte />} />} />
        <Route path="/Gerenciador" element={<PrivateRoute element={<Gerenciador />} />} />
        <Route path="/Alunos" element={<PrivateRoute element={<Alunos />} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
