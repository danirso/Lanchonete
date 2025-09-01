import Card from "./Card";
import styles from "./CardGrid.module.css";

export default function CardGrid({ produtos, onSelect }) {
  if (produtos === null) {
    return <p className="loading">Carregando...</p>;
  }
  if (produtos.length === 0) {
    return <p className="loading">Nenhum produto disponível.</p>;
  }

  return (
    <div className={styles.cardGrid}>
      {produtos.map((item, index) => (
        <Card
          key={item.id}
          item={item}
          onSelect={onSelect}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </div>
  );
}