import QuantitySelector from "./QuantitySelector";
import styles from "./Modal.module.css";
import cookieImg from "../images/cookie.jpg";

const PLACEHOLDER = "https://picsum.photos/800/600?grayscale";

export default function Modal({ produto, quantidade, setQuantidade, onClose, onAdd }) {
  // Verificação de nulidade no objeto 'produto'
  const imageUrl = produto?.url?.startsWith("http") ? produto.url : cookieImg;

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

        <img
          src={imageUrl || PLACEHOLDER}
          alt={produto?.nome}
          className={styles.modalImg}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />

        <h2>{produto?.nome}</h2>
        <p className={styles.modalPrice}>
          R$ {Number(produto?.preco ?? 0).toFixed(2)}
        </p>
        <p className={styles.modalDesc}>
          {produto?.descricao || "Sem descrição disponível."}
        </p>

        <div className={styles.quantityContainer}>
          <QuantitySelector value={quantidade} setValue={setQuantidade} />
        </div>

        <div className={styles.ctaContainer}>
          <button
            className={styles.ctaBtn}
            onClick={() => onAdd(produto, quantidade)}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}