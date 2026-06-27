import styles from "./ToolTip.module.css";

export const ToolTip = ({ text }: { text: string }) => {
  return <p className={styles.info}>⚠️{text}</p>;
};
