import React, { useState, useEffect } from "react";
import api from "../services/api"; // importa o que você já configurou
import "./MainContentAlunos.css";

const MainContentAlunos = () => {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/alunos"); 
      const data = Array.isArray(response.data) ? response.data : [];
      setStudents(data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  const handleAddStudent = () => {
    setCurrentStudent(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await api.delete(`/alunos/${id}`);
        setStudents(students.filter(student => student.id !== id));
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno');
      }
    }
  };

  const handleSaveStudent = async (student) => {
    try {
      const studentWithType = { ...student, tipoUsuario: "ALUNO" };

      if (isEdit) {
        const response = await api.put(`/alunos/${student.id}`, studentWithType);
        setStudents(students.map(s => s.id === student.id ? response.data : s));
      } else {
        const response = await api.post("/alunos", studentWithType);
        setStudents([...students, response.data]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Erro ao salvar aluno");
    }
  };

  return (
    <div className="main-content">
      <h1 className="cadfunc">Hora de Cadastrar </h1>
      <h1 className="cadfunc2">os Alunos!</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>RM</th>
              <th>Turma</th>
              <th>Série</th>
              <th>Período</th>
              <th>CPF</th>
              <th>Status</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.nome}</td>
                <td>{student.email}</td>
                <td>{student.rm || '-'}</td>
                <td>{student.turma || '-'}</td>
                <td>{student.serie || '-'}</td>
                <td>{student.periodo || '-'}</td>
                <td>{student.cpf || '-'}</td>
                <td>{student.statusUsuario}</td>
                <td>
                  <button className="lapis" onClick={() => handleEditStudent(student)}>✏️</button>
                </td>
                <td>
                  <button className="lapis" onClick={() => handleDeleteStudent(student.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalVisible && (
          <Modal
            student={currentStudent}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveStudent}
            isEdit={isEdit}
          />
        )}
      </div>
      <button className="add-button" onClick={handleAddStudent}>
        Incluir
      </button> 
    </div>
  );
};

const Modal = ({ student, onClose, onSave, isEdit }) => {
  const [nome, setNome] = useState(student?.nome || "");
  const [email, setEmail] = useState(student?.email || "");
  const [senha, setSenha] = useState("");
  const [rm, setRm] = useState(student?.rm || "");
  const [turma, setTurma] = useState(student?.turma || "");
  const [serie, setSerie] = useState(student?.serie || "");
  const [periodo, setPeriodo] = useState(student?.periodo || "");
  const [cpf, setCpf] = useState(student?.cpf || "");
  const [statusUsuario, setStatusUsuario] = useState(student?.statusUsuario || "ATIVO");

  const handleSubmit = () => {
    const updatedStudent = { 
      ...(isEdit && { id: student.id }),
      nome, 
      email, 
      ...(senha && { senha }),
      rm: rm || null,
      turma: turma || null,
      serie: serie || null,
      periodo: periodo || null,
      cpf: cpf || null,
      statusUsuario
    }; 
    onSave(updatedStudent);
  };

  useEffect(() => {
    if (student) {
      setNome(student.nome);
      setEmail(student.email);
      setRm(student.rm || "");
      setTurma(student.turma || "");
      setSerie(student.serie || "");
      setPeriodo(student.periodo || "");
      setCpf(student.cpf || "");
      setStatusUsuario(student.statusUsuario || "ATIVO");
      setSenha("");
    } else {
      setNome("");
      setEmail("");
      setSenha("");
      setRm("");
      setTurma("");
      setSerie("");
      setPeriodo("");
      setCpf("");
      setStatusUsuario("ATIVO");
    }
  }, [student]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEdit ? "Editar Aluno" : "Adicionar Aluno"}</h2>
       
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
          RM:
          <input
            type="text"
            value={rm}
            onChange={(e) => setRm(e.target.value)}
          />
        </label>
        <label>
          Turma:
          <input
            type="text"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
          />
        </label>
        <label>
          Série:
          <input
            type="text"
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
          />
        </label>
        <label>
          Período:
          <input
            type="text"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </label>
        <label>
          CPF:
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
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

export default MainContentAlunos;