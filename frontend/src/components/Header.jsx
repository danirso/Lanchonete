import styles from "./Header.module.css";

export default function Header({ darkMode, toggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.title}>Lanche & Prosa</div>
      <button
        className={styles.toggleBtn}
        onClick={toggleTheme}
        aria-label="Alternar tema"
      >
        {darkMode ? "🌞 Claro" : "🌙 Escuro"}
      </button>
    </header>
  );
}