/* eslint-disable no-empty-pattern */
import React, { useState } from "react";
import "./ButtonRegisterCategory.css";
import { registerCategory } from "../services/api";
import CustomAlert from "../contexts/alertLogin"; // Seu componente de alerta


interface TaskButtonProps {
  onClick: () => void;
}

const RegisterCategoryButton: React.FC<TaskButtonProps> = ({ }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState<string>(""); // Defina o tipo para o estado error


  const handleCreateTaskClick = () => {
    // Abre o modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    // Fecha o modal
    setModalOpen(false);
  };

  const handleCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Atualiza o estado com o valor do campo de entrada
    setCategoryName(event.target.value);
  };

  const handleCreateCategory = async () => {

    try {
      const userid = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      if (!userid || !token) {
        // Verifica se userid ou token é nulo e lida com isso
        throw new Error("Usuário não autenticado."); // Ou outra ação adequada
      }
      if (!categoryName.trim()) { 
        setError("Por favor, insira um nome para a categoria.");
        return;
      }

      await registerCategory(token, categoryName, userid);
      
      // Fecha o modal após criar a categoria
      setModalOpen(false);
      window.location.reload();

    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      // Trate o erro conforme necessário, por exemplo, exibindo uma mensagem de erro para o usuário
    }
  };

  return (
    <>
      {!modalOpen && (
        <button className="CreateTask-button" onClick={handleCreateTaskClick}>
          Criar Categoria
        </button>
      )}
      {modalOpen && (
        <div className="modal">
          {/* Conteúdo do seu modal aqui */}
          <div className="modal-content">
          {error && <CustomAlert message={error} />}
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Criar Categoria</h2>
            {/* Campo de entrada para o nome da categoria */}
            <input
              type="text"
              value={categoryName}
              onChange={handleCategoryNameChange}
              placeholder="Nome da Categoria"
            />
            {/* Exibe a mensagem de erro, se houver */}
            {/* Botão para criar a categoria */}
            <button onClick={handleCreateCategory}>Criar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterCategoryButton;
