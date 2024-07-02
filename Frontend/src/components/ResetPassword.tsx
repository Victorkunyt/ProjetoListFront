/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../contexts/alertLogin';
import { Newpassword } from '../services/api';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newPassword.trim() || !repeatNewPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== repeatNewPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      if (!userId) {
        setError('Erro ao obter o User ID.');
        setIsLoading(false);
        return;
      }

      await Newpassword(userId, newPassword, repeatNewPassword);
      setSuccessMessage('Senha redefinida com sucesso!');
      setError('');
      navigate('/login');
    } catch (err) {
      setError('Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Redefinir Senha</h2>
      {error && <CustomAlert message={error} />}
      {successMessage && <CustomAlert message={successMessage} type="success" />}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNewPassword">
          <Form.Label>Nova Senha</Form.Label>
          <InputGroup>
            <Form.Control
              type="password"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formRepeatNewPassword">
          <Form.Label>Repetir Nova Senha</Form.Label>
          <InputGroup>
            <Form.Control
              type="password"
              placeholder="Repita a nova senha"
              value={repeatNewPassword}
              onChange={(e) => setRepeatNewPassword(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" />
              {' '}Redefinindo...
            </>
          ) : (
            'Redefinir Senha'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
