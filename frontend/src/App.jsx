import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("http://192.168.222.131:4000/api/cardapio") // endereço da VM3 backend
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error("Erro ao buscar cardápio:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
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
  );
}

export default App;
