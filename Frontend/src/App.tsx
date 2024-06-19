import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login';
import HomePage from './components/homepage';
import ForgotPasswordPage from './components/SendEmail';
import ResetPassword from './components/ResetPassword';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar se há um token de login válido no armazenamento local
    const token = localStorage.getItem("token");
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (token && storedIsLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []); // Executar este efeito apenas uma vez, quando o componente for montado

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/homepage" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/homepage" element={isLoggedIn ? <HomePage reload={true} /> : <Navigate to="/login" />} />
      <Route path="/Redefinir-senha" element={<ResetPassword/>} />
      <Route path="/esqueceu-senha" element={<ForgotPasswordPage />} />
      
      </Routes>
    </Router>
  );
};

export default App;
