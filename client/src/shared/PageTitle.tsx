import type { ReactNode } from "react";
import styles from "./PageTitle.module.css";

interface PageTitleProps {
  title: string;
  subtitle: ReactNode;
}

export const PageTitle = ({ title, subtitle }: PageTitleProps) => (
  <div>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.subtitle}>{subtitle}</p>
  </div>
);
