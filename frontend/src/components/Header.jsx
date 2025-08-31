export default function Header({ darkMode, toggleTheme }) {
  return (
    <header>
      <div className="title">Lanche & Prosa</div>
      <button
        className="toggle-btn"
        onClick={toggleTheme}
        aria-label="Alternar tema"
      >
        {darkMode ? "🌞 Claro" : "🌙 Escuro"}
      </button>
    </header>
  );
}
