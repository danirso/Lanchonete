import { useState } from "react";

export default function QuantitySelector({ value, setValue, min = 1 }) {
  const decrement = () => {
    if (value > min) setValue(value - 1);
  };

  const increment = () => {
    setValue(value + 1);
  };

  return (
    <div className="qty-selector">
      <button className="qty-btn" onClick={decrement} aria-label="Diminuir">
        –
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => setValue(Number(e.target.value) || min)}
      />
      <button className="qty-btn" onClick={increment} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}
