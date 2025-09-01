import React from "react";
import styles from "./ErrorBoundary.module.css";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <h2>Ops — algo deu errado.</h2>
          <pre>{String(this.state.error)}</pre>
          <p>Abra o console do navegador e o terminal do dev server para detalhes.</p>
        </div>
      );
    }
    return this.props.children;
  }
}