import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import MainContentAlunos from "./MainContentAlunos";

const Alunos = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <MainContentAlunos />
    </div>
  );
};

export default Alunos;