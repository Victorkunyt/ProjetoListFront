/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { SendEmail } from '../services/api';
import CustomAlert from "../contexts/alertLogin"; // Seu componente de alerta
import "./Newpassword.css";
import "./login.css"; 

const NewPasswordPage = () => {
  const [to, setTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      if (!to.trim()) {
        setError("Por favor, preencha o campo email.");
        setIsLoading(false);
        return;
      }
      const responseData = await SendEmail(to);
      const userId = responseData.userId; // Supondo que a resposta contém um campo userId
      localStorage.setItem("userId", userId);
      setSuccessMessage('Email enviado com sucesso!');
    } catch (error) {
      setError('Email não encontrado no banco de dados.');
    }
    setIsLoading(false);
  };

  return (
    <div className="password-reset-container">
      <h2>Esqueci minha senha</h2>
      {error && <CustomAlert message={error} type="error" />}
      {successMessage && <CustomAlert message={successMessage} type="success" />}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicConfirmEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email" 
            placeholder="Digite seu email para recuperar a senha"
            value={to} 
            onChange={(e) => setTo(e.target.value)}
            className="email-input"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" />
              {' '}Enviando...
            </>
          ) : (
            'Enviar'
          )}
        </Button>
      </Form>
      <Button variant="link" onClick={() => window.location.href = '/login'}>
        Voltar ao Login
      </Button>
    </div>
  );
};

export default NewPasswordPage;
