import styles from "./Card.module.css";

const PLACEHOLDER = "https://picsum.photos/800/600?grayscale";

export default function Card({ item, onSelect }) {
  const preco = Number(item.preco ?? 0).toFixed(2);
  const descricaoCurta =
    (item.descricao && item.descricao.length > 60)
      ? item.descricao.substring(0, 60) + "..."
      : item.descricao || "";

  return (
    <article
      key={item.id}
      className={`${styles.card} ${styles.fadeIn}`} // Adicionada classe fadeIn
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(item);
      }}
    >
      <img
        src={item.url || PLACEHOLDER}
        alt={item.nome}
        className={styles.cardImg}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PLACEHOLDER;
        }}
      />
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{item.nome}</h2>
        <p className={styles.cardPrice}>R$ {preco}</p>
        <p className={styles.cardDesc}>{descricaoCurta}</p>
      </div>
    </article>
  );
}