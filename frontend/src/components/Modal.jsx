import QuantitySelector from "./QuantitySelector";

const PLACEHOLDER = "https://picsum.photos/800/600?grayscale";

export default function Modal({ produto, quantidade, setQuantidade, onClose, onAdd }) {
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

        <img
          src={produto.url || PLACEHOLDER}
          alt={produto.nome}
          className="modal-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />

        <h2>{produto.nome}</h2>
        <p className="modal-price">
          R$ {Number(produto.preco ?? 0).toFixed(2)}
        </p>
        <p className="modal-desc">
          {produto.descricao || "Sem descrição disponível."}
        </p>

        <div style={{ margin: "16px 0" }}>
          <QuantitySelector value={quantidade} setValue={setQuantidade} />
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            className="cta-btn"
            onClick={() => onAdd(produto, quantidade)}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
