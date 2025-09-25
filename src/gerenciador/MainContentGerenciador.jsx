import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./MainContentGerenciador.css";

const MainContentGerenciador = () => {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchEmployees(); 
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/usuarios"); 
      // Filtra só os admins
      const data = Array.isArray(response.data) ? response.data : [];
      const admins = data.filter(user => user.nivelAcesso === "ADMIN");
      setEmployees(admins);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
    }
  };

  const handleSaveEmployee = async (employee) => {
    try {
      // Garante que nivelAcesso será sempre ADMIN
      const employeeWithAdmin = { ...employee, nivelAcesso: "ADMIN" };

      if (isEdit) {
        await api.put(`/usuarios/${employee.id}`, employeeWithAdmin); 
        setEmployees(employees.map((emp) => (emp.id === employee.id ? employeeWithAdmin : emp)));
      } else {
        const response = await api.post("/usuarios", employeeWithAdmin); 
        setEmployees([...employees, response.data]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  return (
    <div className="main-content">
      <h1 className="cadfunc">Hora de Cadastrar </h1>
      <h1 className="cadfunc2">os Funcionários!</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nome</th>
              <th>Senha</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.email}</td>
                <td>{employee.nome}</td>
                <td>{employee.senha}</td>
                <td>
                  <button className="lapis" onClick={() => handleEditEmployee(employee)}>✏️</button>
                </td>
                <td>
                  <button className="lapis" onClick={() => handleDeleteEmployee(employee.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalVisible && (
          <Modal
            employee={currentEmployee}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveEmployee}
            isEdit={isEdit}
          />
        )}
      </div>
      <button className="add-button" onClick={handleAddEmployee}>
        Incluir
      </button> 
    </div>
  );
};

const Modal = ({ employee, onClose, onSave, isEdit }) => {
  const [id, setId] = useState(employee?.id || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [nome, setNome] = useState(employee?.nome || ""); 
  const [senha, setSenha] = useState(employee?.senha || "");

  const handleSubmit = () => {
    const updatedEmployee = { id, email, nome, senha }; 
    onSave(updatedEmployee);
  };

  useEffect(() => {
    if (employee) {
      setId(employee.id);
      setEmail(employee.email);
      setNome(employee.nome);
      setSenha(employee.senha);
    } else {
      setId("");
      setEmail("");
      setNome("");
      setSenha("");
    }
  }, [employee]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEdit ? "Editar Funcionário" : "Adicionar Funcionário"}</h2>
       
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>
        {/* NivelAcesso não aparece no formulário, é sempre ADMIN */}

        <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default MainContentGerenciador;
