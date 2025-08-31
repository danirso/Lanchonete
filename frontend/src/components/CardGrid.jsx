import Card from "./Card";

export default function CardGrid({ produtos, onSelect }) {
  if (produtos === null) {
    return <p className="loading">Carregando...</p>;
  }
  if (produtos.length === 0) {
    return <p className="loading">Nenhum produto disponível.</p>;
  }

  return (
    <div className="card-grid">
      {produtos.map((item) => (
        <Card key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
