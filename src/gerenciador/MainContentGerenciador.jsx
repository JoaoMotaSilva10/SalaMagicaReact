import React, { useState, useEffect } from "react";
import { getGerenciadores, criarGerenciador, atualizarGerenciador, deletarGerenciador } from "../services/api";
import "./MainContentGerenciador.css";

const MainContentGerenciador = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchEmployees(); 
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getGerenciadores();
      const employeesData = Array.isArray(data) ? data : [];
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee => 
        employee.nome?.toLowerCase().includes(term.toLowerCase()) ||
        employee.email?.toLowerCase().includes(term.toLowerCase()) ||
        employee.departamento?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmployees(filtered);
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
        await deletarGerenciador(id);
        const newList = employees.filter(employee => employee.id !== id);
        setEmployees(newList);
        setFilteredEmployees(newList);
        alert('Gerenciador excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir gerenciador:', error);
        const newList = employees.filter(employee => employee.id !== id);
        setEmployees(newList);
        setFilteredEmployees(newList);
        if (error.response?.status === 404) {
          alert('Gerenciador não encontrado no servidor. Removido da lista local.');
        } else if (error.response?.status === 500) {
          alert('Não é possível excluir este gerenciador pois ele possui reservas associadas.');
        } else {
          alert('Erro ao excluir gerenciador: ' + (error.response?.data || error.message));
        }
      }
    }
  };

  const handleSaveEmployee = async (employee) => {
    try {
      const employeeWithType = { ...employee, tipoUsuario: "GERENCIADOR" };

      if (isEdit) {
        const updatedEmployee = await atualizarGerenciador(employee.id, employeeWithType);
        const updatedList = employees.map(e => e.id === employee.id ? updatedEmployee : e);
        setEmployees(updatedList);
        setFilteredEmployees(updatedList);
      } else {
        const newEmployee = await criarGerenciador(employeeWithType);
        const newList = [...employees, newEmployee];
        setEmployees(newList);
        setFilteredEmployees(newList);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar gerenciador:", error);
      alert("Erro ao salvar gerenciador");
    }
  };

  return (
    <div className="gerenciadores-container">
      <div className="gerenciadores-header">
        <h1>Gerenciamento de Funcionários</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou departamento..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #333',
              background: '#0a0a0a',
              color: '#fff',
              minWidth: '250px'
            }}
          />
          <button className="btn-add" onClick={handleAddEmployee}>
            Adicionar Funcionário
          </button>
        </div>
      </div>

      <div className="gerenciadores-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="gerenciador-card">
            <div className="gerenciador-header">
              <h3>{employee.nome || 'Nome N/A'}</h3>
              <span className={`status ${employee.statusUsuario?.toLowerCase()}`}>
                {employee.statusUsuario}
              </span>
            </div>
            <p><strong>ID:</strong> #{employee.id}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Unidade:</strong> {employee.unidade || '-'}</p>
            <p><strong>Departamento:</strong> {employee.departamento || '-'}</p>
            <p><strong>Cargo:</strong> {employee.cargo || '-'}</p>
            <div className="gerenciador-actions">
              <button 
                className="btn-edit"
                onClick={() => handleEditEmployee(employee)}
              >
                Editar
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteEmployee(employee.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalVisible && (
        <Modal
          employee={currentEmployee}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveEmployee}
          isEdit={isEdit}
        />
      )}
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? "Editar Funcionário" : "Adicionar Funcionário"}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{isEdit ? "Nova Senha (deixe vazio para manter):" : "Senha:"}</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              {...(!isEdit && { required: true })}
            />
          </div>
          <div className="form-group">
            <label>Unidade:</label>
            <input
              type="text"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Departamento:</label>
            <input
              type="text"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select
              value={statusUsuario}
              onChange={(e) => setStatusUsuario(e.target.value)}
            >
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainContentGerenciador;
