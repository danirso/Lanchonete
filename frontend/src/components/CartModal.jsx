import QuantitySelector from "./QuantitySelector"; // Import do QuantitySelector
import styles from "./CartModal.module.css"; // Import do CSS modular

export default function CartModal({ carrinho, onClose, onRemove, onUpdateQuantity }) {
  const total = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
          ✖
        </button>
        <h2>🛒 Seu Carrinho</h2>

        {carrinho.length === 0 ? (
          <p>Carrinho vazio.</p>
        ) : (
          <ul className={styles.cartList}>
            {carrinho.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemDetails}>
                  <strong>{item.nome}</strong>
                  <p className={styles.itemPrice}>R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
                <div className={styles.itemActions}>
                  <QuantitySelector
                    value={item.quantidade}
                    setValue={(newVal) => onUpdateQuantity(item.id, newVal)}
                  />
                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remover ${item.nome}`}
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h3 className={styles.total}>Total: R$ {total.toFixed(2)}</h3>

        <div className={styles.ctaContainer}>
          <button
            className={styles.ctaBtn}
            onClick={() => {
              alert("Finalizar pedido (demo)");
              // Lógica para ir para a página de checkout
            }}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}