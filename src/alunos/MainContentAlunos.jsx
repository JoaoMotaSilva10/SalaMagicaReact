import React, { useState, useEffect } from "react";
import { getAlunos, criarAluno, atualizarAluno, deletarAluno } from "../services/api";
import "./MainContentAlunos.css";

const MainContentAlunos = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);



  const fetchStudents = async () => {
    try {
      const data = await getAlunos();
      const studentsData = Array.isArray(data) ? data : [];
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.nome?.toLowerCase().includes(term.toLowerCase()) ||
        student.email?.toLowerCase().includes(term.toLowerCase()) ||
        student.rm?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredStudents(filtered);
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
        await deletarAluno(id);
        const newList = students.filter(student => student.id !== id);
        setStudents(newList);
        setFilteredStudents(newList);
        alert('Aluno excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        const newList = students.filter(student => student.id !== id);
        setStudents(newList);
        setFilteredStudents(newList);
        
        if (error.response?.status === 404) {
          alert('Aluno não encontrado. Removido da lista.');
        } else if (error.response?.status === 500) {
          alert('Não é possível excluir este aluno pois ele possui reservas associadas.');
        } else {
          alert('Erro: ' + (error.response?.data || error.message));
        }
      }
    }
  };

  const handleSaveStudent = async (student) => {
    try {
      const studentWithType = { ...student, tipoUsuario: "ALUNO" };

      if (isEdit) {
        const updatedStudent = await atualizarAluno(student.id, studentWithType);
        const updatedList = students.map(s => s.id === student.id ? updatedStudent : s);
        setStudents(updatedList);
        setFilteredStudents(updatedList);
      } else {
        const newStudent = await criarAluno(studentWithType);
        const newList = [...students, newStudent];
        setStudents(newList);
        setFilteredStudents(newList);
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Erro ao salvar aluno");
    }
  };

  return (
    <div className="alunos-container">
      <div className="alunos-header">
        <h1>Gerenciamento de Alunos</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou RM..."
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
          <button className="btn-add" onClick={handleAddStudent}>
            Adicionar Aluno
          </button>
        </div>
      </div>

      <div className="alunos-grid">
        {filteredStudents.map((student) => (
          <div key={student.id} className="aluno-card">
            <div className="aluno-header">
              <h3>#{student.id}</h3>
              <span className={`status ${student.statusUsuario?.toLowerCase()}`}>
                {student.statusUsuario}
              </span>
            </div>
            <p><strong>Nome:</strong> {student.nome}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>RM:</strong> {student.rm || '-'}</p>
            <p><strong>Turma:</strong> {student.turma || '-'}</p>
            <p><strong>Série:</strong> {student.serie || '-'}</p>
            <p><strong>Período:</strong> {student.periodo || '-'}</p>
            <p><strong>CPF:</strong> {student.cpf || '-'}</p>
            <div className="aluno-actions">
              <button 
                className="btn-edit"
                onClick={() => handleEditStudent(student)}
              >
                Editar
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteStudent(student.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalVisible && (
        <Modal
          student={currentStudent}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveStudent}
          isEdit={isEdit}
        />
      )}
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? "Editar Aluno" : "Adicionar Aluno"}</h2>
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
            <label>RM:</label>
            <input
              type="text"
              value={rm}
              onChange={(e) => setRm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Turma:</label>
            <input
              type="text"
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Série:</label>
            <input
              type="text"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Período:</label>
            <input
              type="text"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>CPF:</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
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

export default MainContentAlunos;