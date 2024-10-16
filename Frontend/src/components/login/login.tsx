/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { login, register } from "../../services/api"; // Seu serviço de API
import CustomAlert from "../../contexts/alertLogin"; // Seu componente de alerta
import "./login.css";
import "../login/login.css";
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importe os ícones de olho aberto e fechado


interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o carregamento
  const [loginValue, setLogin] = useState<string>("");
  const [passwordLogin, setPasswordLogin] = useState<string>("");
  const [passwordRegister, setPasswordRegister] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true); // Estado para controlar se está na tela de login
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cellphone, setCellphone] = useState<string>("");
  const [holderid, setHolderid] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [adminUser] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
    
      if (isLogin) {
        // Validações para o login
        if (!loginValue.trim()) {
          setError("Por favor, preencha o campo login.");
          setIsLoading(false);
          return;
        }
        if (!passwordLogin.trim()) {
          setError("Por favor, preencha o campo senha");
          setIsLoading(false);
          return;
        }
        
        const userData = await login(loginValue, passwordLogin);
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        const accessToken = userData.token;
        localStorage.setItem("token", accessToken);
        const accessUserid = userData.refreshToken.generateRefreshToken.UserId;
        localStorage.setItem("userid", accessUserid);    
        navigate('/homepage')
      } else {
        // Validações para o registro
        if (!gender) {
          setError("Por favor, selecione o seu gênero");
          setIsLoading(false);
          return;
        }

      
        // Realiza o registro do usuário
        const userData = await register(
          gender,
          name,
          email,
          cellphone,
          holderid,
          passwordRegister,
          adminUser
        );
    
        console.log("Usuário registrado:", userData);
        setSuccessMessage("Registro bem-sucedido! Faça o login agora.");
        setIsLogin(true); // Após o registro, mudando para a tela de login
      }
      setError("");
    } catch (error) {
      // Verifica se a resposta da API contém uma mensagem de erro específica
      if (error && typeof error === 'object' && 'response' in error) {
        const backendError = error as { response: { data: { message: string } } };
        if (backendError.response && backendError.response.data && backendError.response.data.message) {
          setError(backendError.response.data.message); // Mostra o erro vindo do backend (e.g., "CPF inválido")
        } else {
          setError("Erro desconhecido, tente novamente.");
        }
      } else {
        setError("Usuário não encontrado no banco de dados.");
      }
         
    } finally {
      setIsLoading(false);
    }
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate('/esqueceu-senha');
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Registro"}</h2>
      {error && <CustomAlert message={error} />}
      {successMessage && (
        <CustomAlert message={successMessage} type="success" />
      )}
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <Form.Group controlId="formBasicGender">
              <Form.Label></Form.Label>
              <Form.Control
                as="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Selecione o gênero</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="Outros">Outros</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCellphone">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu celular"
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicHolderid">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu CPF"
                value={holderid}
                onChange={(e) => setHolderid(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        {isLogin && (
          <Form.Group controlId="formBasicLogin">
            <Form.Label>Login</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu login"
              value={loginValue}
              onChange={(e) => setLogin(e.target.value)}
            />
          </Form.Group>
        )}

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={isLogin ? passwordLogin : passwordRegister}
              onChange={(e) => isLogin ? setPasswordLogin(e.target.value) : setPasswordRegister(e.target.value)}
            />
            <InputGroup.Text style={{ alignSelf: 'flex-start' }}>
              <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" />
              {' '}{isLogin ? 'Logando...' : 'Registrando...'}
            </>
          ) : (
            isLogin ? 'Entrar' : 'Registrar'
          )}
        </Button>
      </Form>

      <Button variant="primary" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Registrar' : 'Voltar ao Login'}
      </Button>

      {isLogin && (
        <Button variant="link" onClick={handleForgotPassword} className="forgot-password-link">
          Esqueceu a senha?
        </Button>
      )}
    </div>
  );
};

export default LoginPage;
