import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("http://172.16.102.129:4000/api/cardapio")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao buscar cardápio:", err));
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div>
      <header>
        <span>Lanche & Prosa</span>
        <button className="toggle-btn" onClick={toggleTheme}>
          {darkMode ? "🌞 Claro" : "🌙 Escuro"}
        </button>
      </header>

      <div className="content">
        <h1>🍔 Cardápio da Lanchonete</h1>

        {produtos.length === 0 ? (
          <p>Carregando...</p>
        ) : (
          <ul>
            {produtos.map((item) => (
              <li key={item.id}>
                {item.nome} - R$ {item.preco}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
