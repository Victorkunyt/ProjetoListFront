/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import CustomAlert from '../contexts/alertLogin';
import { Newpassword } from '../services/api';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (!password.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
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

      await Newpassword(userId, password, newPassword, confirmPassword);
      setSuccessMessage('Senha redefinida com sucesso!');
      setError('');
      navigate('/login');
    } catch (err) {
      setError('Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="reset-password-container">
      <h2>Redefinir Senha</h2>
      {error && <CustomAlert message={error} />}
      {successMessage && <CustomAlert message={successMessage} type="success" />}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCurrentPassword">
          <Form.Label>Senha Atual</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha atual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputGroup.Text style={{ alignSelf: 'flex-start' }}>
              <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formNewPassword">
          <Form.Label>Nova Senha</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Repetir Nova Senha</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
