import styles from "./QuantitySelector.module.css";

export default function QuantitySelector({ value, setValue, min = 1 }) {
  const decrement = () => {
    if (value > min) setValue(value - 1);
  };

  const increment = () => {
    setValue(value + 1);
  };

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    // Garante que o valor não seja menor que 'min' e que seja um número válido
    if (!isNaN(newValue) && newValue >= min) {
      setValue(newValue);
    } else if (e.target.value === "") { // Permite que o campo fique vazio temporariamente
      setValue(""); // Deixa o estado como string vazia para o usuário poder digitar
    } else {
      // Se não for um número válido, volta para o valor anterior ou 'min'
      setValue(value === "" ? min : value);
    }
  };

  const handleBlur = (e) => {
    const newValue = Number(e.target.value);
    // Ao sair do campo, se for vazio ou inválido, define para 'min'
    if (isNaN(newValue) || newValue < min || e.target.value === "") {
      setValue(min);
    }
  };

  return (
    <div className={styles.qtySelector}>
      <button className={styles.qtyBtn} onClick={decrement} aria-label="Diminuir" disabled={value <= min}>
        –
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur} // Adiciona o evento onBlur
        aria-label="Quantidade"
      />
      <button className={styles.qtyBtn} onClick={increment} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}