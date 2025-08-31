import React, { useEffect, useState } from "react";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import CardGrid from "./components/CardGrid";
import Modal from "./components/Modal";
import CartModal from "./components/CartModal";
import Toast from "./components/Toast";
import styles from "./App.module.css";

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
  const [toasts, setToasts] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);

  const API_URL = "/api/cardapio";

  // Lógica para adicionar e remover toasts do array
  const addToast = (message) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 3000);
  };

  // Persistência do carrinho com localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('carrinho');
    if (savedCart) {
      setCarrinho(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  // tema
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // esc / scroll
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setProdutoSelecionado(null);
        setMostrarCarrinho(false);
      }
    };
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
          descricao: p?.descricao ?? "", // Adicionado
          url: p?.url ?? PLACEHOLDER, // Adicionado
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
            {
              id: "m3",
              nome: "Batata Frita (demo)",
              preco: 8.0,
              descricao: "Demo: porção de batatas fritas crocantes.",
              url: "https://picsum.photos/600/360?random=3",
            },
            {
              id: "m4",
              nome: "Refrigerante (demo)",
              preco: 5.5,
              descricao: "Demo: lata de refrigerante 350ml.",
              url: "https://picsum.photos/600/360?random=4",
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
    setProdutoSelecionado(null);
    addToast(`${qtd}x ${produto.nome} adicionado(s) ao carrinho!`);
  };

  // novas funções para o carrinho
  const removerItemDoCarrinho = (id) => {
    setCarrinho((prev) => prev.filter(item => item.id !== id));
  };
  
  const atualizarQuantidadeItem = (id, novaQuantidade) => {
    if (novaQuantidade < 1) {
      removerItemDoCarrinho(id);
      return;
    }
    setCarrinho((prev) =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
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
            onRemove={removerItemDoCarrinho}
            onUpdateQuantity={atualizarQuantidadeItem}
          />
        )}

        {carrinho.length > 0 && (
          <button
            className={styles.cartFab}
            onClick={() => setMostrarCarrinho(true)}
          >
            Seu Carrinho ({carrinho.reduce((acc, p) => acc + p.quantidade, 0)}) 🛒
          </button>
        )}

        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} />
        ))}
      </div>
    </ErrorBoundary>
  );
}