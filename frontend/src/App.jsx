import React, { useEffect, useState } from "react";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import CardGrid from "./components/CardGrid";
import Modal from "./components/Modal";
import CartModal from "./components/CartModal"; // novo componente

const PLACEHOLDER = "https://picsum.photos/800/600?grayscale";

export default function App() {
  const [produtos, setProdutos] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);

  const API_URL = "/api/cardapio";

  // tema
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // esc / scroll
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setProdutoSelecionado(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      produtoSelecionado || mostrarCarrinho ? "hidden" : "auto";
  }, [produtoSelecionado, mostrarCarrinho]);

  // busca produtos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.rows ?? [];
        const sanitized = arr.map((p, idx) => ({
          id: p?.id ?? `i-${idx}`,
          nome: p?.nome ?? "Produto sem nome",
          preco: Number(p?.preco ?? 0),
          descricao: p?.descricao ?? "",
          url: p?.url ?? PLACEHOLDER,
        }));
        if (mounted) setProdutos(sanitized);
      } catch (err) {
        console.error("Erro ao buscar cardápio:", err);
        if (mounted) {
          setProdutos([
            {
              id: "m1",
              nome: "X-Burger (demo)",
              preco: 15.9,
              descricao: "Demo: hambúrguer artesanal com queijo, alface e tomate.",
              url: "https://picsum.photos/600/360?random=1",
            },
            {
              id: "m2",
              nome: "X-Salada (demo)",
              preco: 18.5,
              descricao: "Demo: hambúrguer com salada fresca, queijo e molho especial.",
              url: "https://picsum.photos/600/360?random=2",
            },
          ]);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const toggleTheme = () => setDarkMode((s) => !s);

  // adicionar ao carrinho
  const adicionarAoCarrinho = (produto, qtd) => {
    setCarrinho((prev) => {
      const existente = prev.find((p) => p.id === produto.id);
      if (existente) {
        return prev.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + qtd } : p
        );
      }
      return [...prev, { ...produto, quantidade: qtd }];
    });
    setProdutoSelecionado(null); // fecha modal após adicionar
  };

  return (
    <ErrorBoundary>
      <div className="app-root">
        <Header darkMode={darkMode} toggleTheme={toggleTheme} />

        <main className="content">
          <h1>🍔 Cardápio da Lanchonete</h1>
          <CardGrid
            produtos={produtos}
            onSelect={(item) => {
              setProdutoSelecionado(item);
              setQuantidade(1);
            }}
          />
        </main>

        {produtoSelecionado && (
          <Modal
            produto={produtoSelecionado}
            quantidade={quantidade}
            setQuantidade={setQuantidade}
            onClose={() => setProdutoSelecionado(null)}
            onAdd={adicionarAoCarrinho}
          />
        )}

        {mostrarCarrinho && (
          <CartModal
            carrinho={carrinho}
            onClose={() => setMostrarCarrinho(false)}
          />
        )}

        {carrinho.length > 0 && (
          <button
            className="cart-fab"
            onClick={() => setMostrarCarrinho(true)}
          >
            Seu Carrinho ({carrinho.reduce((acc, p) => acc + p.quantidade, 0)}) 🛒
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}
