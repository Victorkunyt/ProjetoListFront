/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { category, getUsers, GeneratePDF, GetPDF, deleteCategory, updateCategory, updateTasks } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../buttonSair/LogoutButton';
import RegisterTaskButton from '../buttonTarefa/RegisterTaskButton';
import RegisterCategoryButton from '../buttonCategoria/ButtonRegisterCategory';
import Notificationtsx from '../notification/notification';
import CustomAlert from '../../contexts/alertLogin'; // Seu componente de alerta
import './homepage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface HomePageProps {
  reload: boolean;
}

function HomePage({ reload }: HomePageProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados já foram carregados
  const [alert, setAlert] = useState({ message: '', type: 'error' }); // Definir o tipo padrão como 'error'
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn || isLoggedIn === 'false') {
          navigate('/login');
          return;
        }

        // Verificar se os dados já foram carregados para evitar chamadas duplicadas
        if (!dataLoaded) {
          const [categoryData, userData] = await Promise.all([
            category(userid, token),
            getUsers(userid, token),
          ]);

          if (categoryData && categoryData.Category) {
            setCategories(categoryData.Category);
          }
          if (userData && userData.users) {
            setUsers(userData.users);
          }

          // Marcar os dados como carregados
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (reload) {
      fetchData();
    }
  }, [navigate, reload, dataLoaded, userid, token]); // Adicionar dataLoaded como dependência do useEffect

  const handleLogout = async () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGenerateAndDownloadPDF = async () => {
    if (userid) {
      if (categories.length === 0) {
        setAlert({ message: 'Nenhuma Categoria Cadastrada. Não é possível gerar o PDF.', type: 'warning' });
        return;
      }

      try {
        await GeneratePDF(userid, token); // Gera o PDF
        const data = await GetPDF(userid, token); // Faz o download do PDF

        // Criar um Blob a partir dos dados binários
        const blob = new Blob([data], { type: 'application/pdf' });

        // Criar uma URL para o Blob
        const url = window.URL.createObjectURL(blob);

        // Criar um link temporário e clicar nele para iniciar o download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userid}_report.pdf`;
        document.body.appendChild(link);
        link.click();

        // Limpar o URL do Blob e remover o link temporário
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating or downloading PDF:', error);
        setAlert({ message: 'Erro ao gerar ou baixar o PDF.', type: 'error' });
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId, token);
      setCategories(categories.filter((category) => category.id !== categoryId));
      setAlert({ message: 'Categoria excluída com sucesso.', type: 'success' });
    } catch (error) {
      console.error('Error deleting category:', error);
      setAlert({ message: 'Erro ao excluir categoria.', type: 'error' });
    }
  };

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    categoryId: string
  ) => {
    e.stopPropagation(); // Impedir a propagação do evento de clique
    handleDeleteCategory(categoryId);
  };

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>('');

  const handleEditCategory = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId);
    setNewCategoryName(currentName);
  };

  const handleEditTask = (taskId: string, currentName: string) => {
    setEditingTaskId(taskId);
    setNewTaskName(currentName);
  };

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  };

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskName(e.target.value);
  };

  const saveCategoryName = async (categoryId: string) => {
    try {
      await updateCategory(categoryId, token, newCategoryName);
      setCategories(categories.map(category => category.id === categoryId ? { ...category, nameCategory: newCategoryName } : category));
      setEditingCategoryId(null);
    } catch (error) {
      console.error('Error updating category:', error);
      setAlert({ message: 'Erro ao atualizar categoria.', type: 'error' });
    }
  };

  const saveTaskName = async (taskId: string, categoryId: string) => {
    try {
      await updateTasks(taskId, token, newTaskName);
      setCategories(categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            tasks: category.tasks.map((task: { id: string; }) => task.id === taskId ? { ...task, nametask: newTaskName } : task)
          };
        }
        return category;
      }));
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setAlert({ message: 'Erro ao atualizar tarefa.', type: 'error' });
    }
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingTaskId(null);
    setNewCategoryName('');
    setNewTaskName('');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <CustomAlert message={alert.message} type={alert.type} /> {/* Passando type dinamicamente */}
      <div className="categories">
        {categories.map((category: any, index: number) => (
          <div className="category" key={index}>
            <div className="category-header">
              {editingCategoryId === category.id ? (
                <>
                  <input 
                    type="text" 
                    value={newCategoryName} 
                    onChange={handleCategoryNameChange}
                  />
                  <button onClick={() => saveCategoryName(category.id)}>Salvar</button>
                  <button onClick={cancelEditing}>Cancelar</button>
                </>
              ) : (
                <>
                  <h3>{category.nameCategory}</h3>
                  <button onClick={() => handleEditCategory(category.id, category.nameCategory)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </>
              )}
              <button className="delete-button" onClick={(e) => handleDeleteButtonClick(e, category.id)}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <ul className="tasks">
              {category.tasks.map((task: any, taskIndex: number) => (
                <li key={taskIndex}>
                  {editingTaskId === task.id ? (
                    <>
                      <input 
                        type="text" 
                        value={newTaskName} 
                        onChange={handleTaskNameChange}
                      />
                      <button onClick={() => saveTaskName(task.id, category.id)}>Salvar</button>
                      <button onClick={cancelEditing}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      {task.nametask}
                      <button onClick={() => handleEditTask(task.id, task.nametask)}>
                        <i className="fas fa-edit"></i>
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="notification-container">
        <Notificationtsx reload={reload} />
      </div>
      <div className="logout-button-container">
        <LogoutButton onClick={handleLogout} />
      </div>
      <div className="RegisterTask2-button-container">
        <RegisterCategoryButton
          onClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
        <RegisterTaskButton categories={categories} users={users} />
      </div>
      <div className="pdf-buttons-container">
        <button onClick={handleGenerateAndDownloadPDF}>Baixar PDF</button>
      </div>
    </div>
  );
}

export default HomePage;
