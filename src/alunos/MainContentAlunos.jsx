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
      const studentWithAluno = { ...student, tipoUsuario: "ALUNO" };

      if (isEdit) {
        const response = await api.put(`/alunos/${student.id}`, studentWithAluno);
        setStudents(students.map(s => s.id === student.id ? response.data : s));
      } else {
        const response = await api.post("/alunos", studentWithAluno);
        setStudents([...students, response.data]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
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
              <th>Email</th>
              <th>Nome</th>
              <th>Senha</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.email}</td>
                <td>{student.nome}</td>
                <td>{student.senha}</td>
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
  const [id, setId] = useState(student?.id || "");
  const [email, setEmail] = useState(student?.email || "");
  const [nome, setNome] = useState(student?.nome || ""); 
  const [senha, setSenha] = useState(student?.senha || "");

  const handleSubmit = () => {
    const updatedStudent = { id, email, nome, senha }; 
    onSave(updatedStudent);
  };

  useEffect(() => {
    if (student) {
      setId(student.id);
      setEmail(student.email);
      setNome(student.nome);
      setSenha(student.senha);
    } else {
      setId("");
      setEmail("");
      setNome("");
      setSenha("");
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

        <button onClick={handleSubmit}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default MainContentAlunos;