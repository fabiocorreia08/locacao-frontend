import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redireciona para /home se já estiver logado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await login({ username, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      navigate("/home"); // ✅ vai pra rota protegida
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form className="form-locatario" onSubmit={handleLogin}>
        <label htmlFor="username">Usuário</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite seu usuário"
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
        />

        {erro && <div className="erro-usuario-senha">{erro}</div>}

        <div className="form-acoes">
          <button
            type="button"
            className="cancelar"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Cancelar
          </button>

          <button type="submit" className="salvar" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;