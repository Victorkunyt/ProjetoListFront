/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { category, getUsers, GeneratePDF, GetPDF } from "../../services/api";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../buttonSair/LogoutButton";
import RegisterTaskButton from "../buttonTarefa/RegisterTaskButton";
import RegisterCategoryButton from "../buttonCategoria/ButtonRegisterCategory";
import Notificationtsx from '../notification/notification';
import "./homepage.css";

interface HomePageProps {
  reload: boolean;
}

function HomePage({ reload }: HomePageProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Estado para controlar se os dados já foram carregados
  const navigate = useNavigate();
  const userid = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn || isLoggedIn === "false") {
          navigate("/login");
          return;
        }

        // Verificar se os dados já foram carregados para evitar chamadas duplicadas
        if (!dataLoaded) {
          const [categoryData, userData] = await Promise.all([
            category(userid, token),
            getUsers(userid, token)
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
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (reload) {
      fetchData();
    }
  }, [navigate, reload,]); // Adicionar dataLoaded como dependência do useEffect

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleGenerateAndDownloadPDF = async () => {
    if (userid) {
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
        console.error("Error generating or downloading PDF:", error);
      }
    }
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
      <div className="categories">
        {categories.map((category: any, index: number) => (
          <div className="category" key={index}>
            <h3>{category.nameCategory}</h3>
            <ul className="tasks">
              {category.tasks.map((task: any, taskIndex: number) => (
                <li key={taskIndex}>{task.nametask}</li>
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
        <RegisterCategoryButton onClick={function (): void {
          throw new Error("Function not implemented.");
        }} />
        <RegisterTaskButton categories={categories} users={users} />
      </div>
      <div className="pdf-buttons-container">
        <button onClick={handleGenerateAndDownloadPDF}>Gerar e Baixar PDF</button>
      </div>
    </div>
  );
}

export default HomePage;
