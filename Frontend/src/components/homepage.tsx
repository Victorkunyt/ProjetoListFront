/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { category, getUsers } from "../services/api";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import RegisterTaskButton from "./RegisterTaskButton";
import RegisterCategoryButton from "./ButtonRegisterCategory";
import Notificationtsx from './notification/notification';
import "./homepage.css";

interface HomePageProps {
  reload: boolean;
}

function HomePage({ reload }: HomePageProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const userid = localStorage.getItem("userid");
        const token = localStorage.getItem("token");
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn || isLoggedIn === "false") {
          navigate("/login");
          return;
        }
        const categoryData = await category(userid, token); // Use o userId para chamar a função de categoria
        const userData = await getUsers(userid,token);
 
        if (categoryData && categoryData.Category) {
          setCategories(categoryData.Category);
        } 
        if (userData && userData.users) {
          setUsers(userData.users);
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
  }, [navigate, reload]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/login");
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
    </div>
  );
}

export default HomePage;
