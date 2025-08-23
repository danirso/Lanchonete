import { useEffect, useState } from "react";

function App() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("/api/cardapio")
      .then(res => res.json())
      .then(data => setProdutos(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🍔 Lanchonete</h1>
      <ul>
        {produtos.map((p) => (
          <li key={p.id}>{p.nome} - R$ {p.preco}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
