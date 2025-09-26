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
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import { useAuth } from "../contexts/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Redireciona para home se já estiver logado */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        {/* Todas as rotas protegidas */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Reservas" element={<ProtectedRoute><Reservas /></ProtectedRoute>} />
        <Route path="/ReservasMarcadas" element={<ProtectedRoute><ReservasMarcadasPage /></ProtectedRoute>} />
        <Route path="/ReservasRealizadas" element={<ProtectedRoute><ReservasRealizadasPage /></ProtectedRoute>} />
        <Route path="/Suporte" element={<ProtectedRoute><Suporte /></ProtectedRoute>} />
        <Route path="/Gerenciador" element={<AdminRoute><Gerenciador /></AdminRoute>} />
        <Route path="/Alunos" element={<AdminRoute><Alunos /></AdminRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
