// LogoutButton.tsx
import React from "react";
import "./LogoutButton.css";

interface LogoutButtonProps {
  onClick: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  const handleLogoutClick = () => {
    onClick();
    window.location.reload(); // Reload da página
  };

  return (
    <button className="logout-button" onClick={handleLogoutClick}>
      Deslogar
    </button>
  );
};

export default LogoutButton;

