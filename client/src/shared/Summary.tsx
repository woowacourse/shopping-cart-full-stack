import type { ReactNode } from "react";
import styles from "./Summary.module.css";

interface SummaryItemProps {
  title: string;
  content: ReactNode;
}

export const SummaryItem = ({ title, content }: SummaryItemProps) => {
  return (
    <div className={styles.item}>
      <span className={styles.itemTitle}>{title}</span>
      <span className={styles.itemContent}>{content}</span>
    </div>
  );
};

export const SummaryContainer = ({ children }: { children: ReactNode }) => {
  return <div className="container">{children}</div>;
};
