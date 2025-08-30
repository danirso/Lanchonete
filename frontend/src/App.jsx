import React, { useEffect, useState } from "react";
import "./App.css";

const PLACEHOLDER = "https://picsum.photos/800/600?grayscale";

/* Error Boundary para evitar tela em branco se algo quebrar no render */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Ops — algo deu errado.</h2>
          <pre>{String(this.state.error)}</pre>
          <p>Abra o console do navegador e o terminal do dev server para detalhes.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [produtos, setProdutos] = useState(null); // null = carregando, [] = vazio
  const [darkMode, setDarkMode] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const API_URL = "http://192.168.30.132:4000/api/cardapio";

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  // fecha modal com ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setProdutoSelecionado(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // trava scroll quando modal aberto
  useEffect(() => {
    document.body.style.overflow = produtoSelecionado ? "hidden" : "auto";
  }, [produtoSelecionado]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // normaliza: aceita array direto ou responde com object contendo rows
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
        // fallback: dados mock para testar a UI localmente
        if (mounted) {
          setProdutos([
            {
              id: "m1",
              nome: "X-Burger (demo)",
              preco: 15.9,
              descricao:
                "Demo: hambúrguer artesanal com queijo, alface e tomate. Esse item aparece quando o fetch falha.",
              url: "https://picsum.photos/600/360?random=1",
            },
            {
              id: "m2",
              nome: "X-Salada (demo)",
              preco: 18.5,
              descricao:
                "Demo: hambúrguer com salada fresca, queijo e molho especial.",
              url: "https://picsum.photos/600/360?random=2",
            },
          ]);
        }
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => setDarkMode((s) => !s);

  return (
    <ErrorBoundary>
      <div className="app-root">
        <header>
          <div className="title">Lanche & Prosa</div>
          <button
            className="toggle-btn"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {darkMode ? "🌞 Claro" : "🌙 Escuro"}
          </button>
        </header>

        <main className="content">
          <h1>🍔 Cardápio da Lanchonete</h1>

          {produtos === null ? (
            <p className="loading">Carregando...</p>
          ) : produtos.length === 0 ? (
            <p className="loading">Nenhum produto disponível.</p>
          ) : (
            <div className="card-grid">
              {produtos.map((item) => {
                const preco = Number(item.preco ?? 0).toFixed(2);
                const descricaoCurta =
                  (item.descricao && item.descricao.length > 60)
                    ? item.descricao.substring(0, 60) + "..."
                    : item.descricao || "";

                return (
                  <article
                    key={item.id}
                    className="card"
                    onClick={() => setProdutoSelecionado(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setProdutoSelecionado(item);
                    }}
                  >
                    <img
                      src={item.url || PLACEHOLDER}
                      alt={item.nome}
                      className="card-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                    <div className="card-body">
                      <h2 className="card-title">{item.nome}</h2>
                      <p className="card-price">R$ {preco}</p>
                      <p className="card-desc">{descricaoCurta}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {produtoSelecionado && (
          <div
            className="modal-overlay"
            onClick={() => setProdutoSelecionado(null)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                className="modal-close"
                onClick={() => setProdutoSelecionado(null)}
                aria-label="Fechar"
              >
                ✖
              </button>

              <img
                src={produtoSelecionado.url || PLACEHOLDER}
                alt={produtoSelecionado.nome}
                className="modal-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />

              <h2>{produtoSelecionado.nome}</h2>
              <p className="modal-price">
                R$ {Number(produtoSelecionado.preco ?? 0).toFixed(2)}
              </p>
              <p className="modal-desc">
                {produtoSelecionado.descricao || "Sem descrição disponível."}
              </p>

              <div style={{ marginTop: 16 }}>
                <button
                  className="cta-btn"
                  onClick={() => {
                    alert(`Adicionar ${produtoSelecionado.nome} ao carrinho (demo)`);
                  }}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
