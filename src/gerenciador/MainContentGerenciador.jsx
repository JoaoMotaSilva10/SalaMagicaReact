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
      const response = await api.get("/gerenciadores"); 
      const data = Array.isArray(response.data) ? response.data : [];
      setEmployees(data);
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
    if (window.confirm('Tem certeza que deseja excluir este gerenciador?')) {
      try {
        await api.delete(`/gerenciadores/${id}`);
        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        console.error('Erro ao excluir gerenciador:', error);
        alert('Erro ao excluir gerenciador');
      }
    }
  };

  const handleSaveEmployee = async (employee) => {
    try {
      const employeeWithType = { ...employee, tipoUsuario: "GERENCIADOR" };

      if (isEdit) {
        const response = await api.put(`/gerenciadores/${employee.id}`, employeeWithType);
        setEmployees(employees.map(e => e.id === employee.id ? response.data : e));
      } else {
        const response = await api.post("/gerenciadores", employeeWithType); 
        setEmployees([...employees, response.data]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar gerenciador:", error);
      alert("Erro ao salvar gerenciador");
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
              <th>Nome</th>
              <th>Email</th>
              <th>Unidade</th>
              <th>Departamento</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.nome}</td>
                <td>{employee.email}</td>
                <td>{employee.unidade || '-'}</td>
                <td>{employee.departamento || '-'}</td>
                <td>{employee.cargo || '-'}</td>
                <td>{employee.statusUsuario}</td>
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
  const [nome, setNome] = useState(employee?.nome || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [senha, setSenha] = useState("");
  const [unidade, setUnidade] = useState(employee?.unidade || "");
  const [departamento, setDepartamento] = useState(employee?.departamento || "");
  const [cargo, setCargo] = useState(employee?.cargo || "");
  const [statusUsuario, setStatusUsuario] = useState(employee?.statusUsuario || "ATIVO");

  const handleSubmit = () => {
    const updatedEmployee = { 
      ...(isEdit && { id: employee.id }),
      nome, 
      email, 
      ...(senha && { senha }),
      unidade,
      departamento,
      cargo,
      statusUsuario
    }; 
    onSave(updatedEmployee);
  };

  useEffect(() => {
    if (employee) {
      setNome(employee.nome);
      setEmail(employee.email);
      setUnidade(employee.unidade || "");
      setDepartamento(employee.departamento || "");
      setCargo(employee.cargo || "");
      setStatusUsuario(employee.statusUsuario || "ATIVO");
      setSenha("");
    } else {
      setNome("");
      setEmail("");
      setSenha("");
      setUnidade("");
      setDepartamento("");
      setCargo("");
      setStatusUsuario("ATIVO");
    }
  }, [employee]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEdit ? "Editar Gerenciador" : "Adicionar Gerenciador"}</h2>
       
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          {isEdit ? "Nova Senha (deixe vazio para manter):" : "Senha:"}
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            {...(!isEdit && { required: true })}
          />
        </label>
        <label>
          Unidade:
          <input
            type="text"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          />
        </label>
        <label>
          Departamento:
          <input
            type="text"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          />
        </label>
        <label>
          Cargo:
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
        </label>
        <label>
          Status:
          <select
            value={statusUsuario}
            onChange={(e) => setStatusUsuario(e.target.value)}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </label>

        <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default MainContentGerenciador;
