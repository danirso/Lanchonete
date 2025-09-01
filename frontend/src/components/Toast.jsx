import styles from "./Toast.module.css";

export default function Toast({ message }) {
  return (
    <div className={styles.toastContainer}>
      <div className={styles.toastMessage}>{message}</div>
    </div>
  );
}