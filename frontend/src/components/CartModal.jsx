export default function CartModal({ carrinho, onClose }) {
  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ✖
        </button>
        <h2>🛒 Seu Carrinho</h2>

        {carrinho.length === 0 ? (
          <p>Carrinho vazio.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {carrinho.map((item) => (
              <li key={item.id} style={{ margin: "8px 0", textAlign: "left" }}>
                <strong>{item.quantidade}x</strong> {item.nome} — R${" "}
                {(item.preco * item.quantidade).toFixed(2)}
              </li>
            ))}
          </ul>
        )}

        <h3 style={{ marginTop: 16 }}>Total: R$ {total.toFixed(2)}</h3>

        <div style={{ marginTop: 16 }}>
          <button className="cta-btn" onClick={() => alert("Finalizar pedido (demo)")}>
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
