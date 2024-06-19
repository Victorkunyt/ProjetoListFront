/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { login, register } from "../services/api"; // Seu serviço de API
import CustomAlert from "../contexts/alertLogin"; // Seu componente de alerta
import "./login.css";
import "./Newpassword.css";
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importe os ícones de olho aberto e fechado

interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o carregamento
  const [loginValue, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true); // Estado para controlar se está na tela de login
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cellphone, setCellphone] = useState<string>("");
  const [holderid, setHolderid] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const specialCaracterRegex = /[@]/;
    try {
      setIsLoading(true);

      if (isLogin) {
        if (!loginValue.trim()) {
          setError("Por favor, preencha o campo login.");
          setIsLoading(false);
          return;
        }
        if (!password.trim()) {
          setError("Por favor, preencha o campo senha");
          setIsLoading(false);
          return;
        }
        const userData = await login(loginValue, password);
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);

        const accessToken = userData.token;
        localStorage.setItem("token", accessToken);

        const accessUserid = userData.refreshToken.generateRefreshToken.UserId;
        localStorage.setItem("userid", accessUserid);

        setSuccessMessage("Login bem-sucedido!");

        navigate('/homepage');
      } else {
        if (!gender) {
          setError("Por favor, selecione o seu gênero");
          setIsLoading(false);
          return;
        }
        if (!name.trim()) {
          setError("Por favor, preencha o campo nome");
          setIsLoading(false);
          return;
        }
        if (!email.trim()) {
          setError("Por favor, preencha o campo email");
          setIsLoading(false);
          return;
        }
        if (!specialCaracterRegex.test(email) || !email.includes(".")) {
          setError("O Email precisa possuir (.,@)");
          setIsLoading(false);
          return;
        }
        if (!cellphone.trim()) {
          setError("Por favor, preencha o campo telefone");
          setIsLoading(false);
          return;
        }
        if (cellphone.length !== 11) {
          setError("O Numero de Celular tem que ter 11 Digitos");
          setIsLoading(false);
          return;
        }
        if (!holderid.trim()) {
          setError("Por favor, preencha o campo CPF");
          setIsLoading(false);
          return;
        }
        if (!password.trim()) {
          setError("Por favor, preencha com uma senha válida");
          setIsLoading(false);
          return;
        }
        const numericDigitRegex = /\d/;
        // eslint-disable-next-line no-useless-escape
        const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

        if (password.length < 8) {
          setError('Senha precisa possuir pelo menos 8 caracteres');
          setIsLoading(false);
          return;
        }
        if (!/[A-Z]/.test(password)) {
          setError('Senha precisa possuir pelo menos 1 letra Maiúscula');
          setIsLoading(false);
          return;
        }
        if (!/[a-z]/.test(password)) {
          setError('Senha precisa possuir pelo menos 1 letra Minúscula');
          setIsLoading(false);
          return;
        }
        if (!numericDigitRegex.test(password)) {
          setError('Senha precisa possuir pelo menos um Digito Numérico');
          setIsLoading(false);
          return;
        }
        if (!specialCharacterRegex.test(password)) {
          setError('Senha precisa possuir pelo menos um caractere especial (e.g, !@#$%)');
          setIsLoading(false);
          return;
        }
        const userData = await register(
          gender,
          name,
          email,
          cellphone,
          holderid,
          password
        );
        console.log("Usuário registrado:", userData);
        setSuccessMessage("Registro bem-sucedido! Faça o login agora.");
        setIsLogin(true); // Após o registro, mudando para a tela de login
      }
      setError("");
    } catch (error) {
      setError("Usuário não encontrado no banco de dados.");
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
              <Form.Label>Gênero</Form.Label>
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
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu telefone"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isLogin && (
              <InputGroup.Text style={{ alignSelf: 'flex-start' }}>
                <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </InputGroup.Text>
            )}
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" />
              {' '}Logando...
            </>
          ) : (
            isLogin ? "Entrar" : "Registrar"
          )}
        </Button>
      </Form>
      <Button variant="primary" onClick={() => setIsLogin(!isLogin)}>
{isLogin ? "Registrar" : "Voltar ao Login"}
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
