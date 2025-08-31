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
      className="card"
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
}
