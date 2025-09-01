import styles from "./Card.module.css";
import cookieImg from "../images/cookie.jpg";

const PLACEHOLDER = "https://picsum.photos/800/600?grayscale";

export default function Card({ item, onSelect }) {
  // A verificação `item ?? {}` garante que `item` nunca seja null/undefined
  const preco = Number(item?.preco ?? 0).toFixed(2);
  const descricaoCurta =
    (item?.descricao && item?.descricao.length > 60)
      ? item.descricao.substring(0, 60) + "..."
      : item?.descricao || "";

  const imageUrl = item?.url?.startsWith("http") ? item.url : cookieImg;

  return (
    <article
      key={item?.id}
      className={`${styles.card} ${styles.fadeIn}`}
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(item);
      }}
    >
      <img
        src={imageUrl}
        alt={item?.nome}
        className={styles.cardImg}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PLACEHOLDER;
        }}
      />
      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>{item?.nome}</h2>
        <p className={styles.cardPrice}>R$ {preco}</p>
        <p className={styles.cardDesc}>{descricaoCurta}</p>
      </div>
    </article>
  );
}