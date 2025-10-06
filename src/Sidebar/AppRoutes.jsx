import React from "react";
import Home from "../Home/Home";
import Login from "../Login/Login";
import EsqueciSenha from "../EsqueciSenha/EsqueciSenha";
import AnaliseReservasPage from "../AnaliseReservas/AnaliseReservasPage";
import SuportePage from "../Suporte/SuportePage";
import ReservasMarcadasPageWrapper from '../ReservasMarcadas/ReservasMarcadasPage';
import GerenciadorPage from "../gerenciador/GerenciadorPage";
import AlunosPage from "../alunos/AlunosPage";
import RecursosPage from "../Recursos/RecursosPage";
import ReservasPage from "../Reservas/ReservasPage";
import ReservasRealizadasPageWrapper from "../ReservasRealizadas/ReservasRealizadasPage";
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
        <Route path="/Reservas" element={<ProtectedRoute><AnaliseReservasPage /></ProtectedRoute>} />
        <Route path="/ReservasMarcadas" element={<ProtectedRoute><ReservasMarcadasPageWrapper /></ProtectedRoute>} />
        <Route path="/ReservasRealizadas" element={<ProtectedRoute><ReservasRealizadasPageWrapper /></ProtectedRoute>} />
        <Route path="/Suporte" element={<ProtectedRoute><SuportePage /></ProtectedRoute>} />
        <Route path="/Gerenciador" element={<AdminRoute><GerenciadorPage /></AdminRoute>} />
        <Route path="/Alunos" element={<AdminRoute><AlunosPage /></AdminRoute>} />
        <Route path="/Recursos" element={<ProtectedRoute><RecursosPage /></ProtectedRoute>} />
        <Route path="/ReservasGerenciamento" element={<ProtectedRoute><ReservasPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
