/* eslint-disable no-empty-pattern */
/* eslint-disable no-empty-pattern */
import React, { useState } from "react";
import "./ButtonRegisterCategory.css";
import { registerTask } from "../services/api";
import CustomAlert from "../contexts/alertLogin"; // Seu componente de alerta

interface RegisterTaskButtonProps {
  categories: { id: string; nameCategory: string }[];
  users: { id: string; name: string }[];
}

const RegisterTaskButton: React.FC<RegisterTaskButtonProps> = ({ categories }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nametask, setTaskName] = useState("");
  const [error, setError] = useState<string>(""); // Defina o tipo para o estado error
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const handleCreateTaskClick = () => {
    setModalOpen(true); // Abre o modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Fecha o modal
  };

  const handleCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value); // Atualiza o estado com o valor do campo de entrada
  };

  const handleCreateTask = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      if (!userid || !token) {
        throw new Error("Usuário não autenticado."); // Verifica se userid ou token é nulo e lida com isso
      }
      if (!nametask.trim()) {
        setError("Por favor, insira um nome para a Tarefa.");
        return;
      }

      if (!selectedCategoryId) {
        setError("Por favor, selecione uma categoria");
        return;
      }

      await registerTask(token, nametask, selectedCategoryId, userid);
      
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
          Criar Tarefa
        </button>
      )}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            {error && <CustomAlert message={error} />}
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Criar Tarefa</h2>
            <input
              type="text"
              value={nametask}
              onChange={handleCategoryNameChange}
              placeholder="Nome da Tarefa"
            />
            <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.nameCategory}</option>
              ))}
            </select>
            <button onClick={handleCreateTask}>Criar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterTaskButton;


