import type { ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

const ModalHeader = ({ children }: { children: ReactNode }) => (
  <div className={styles.header}>{children}</div>
);

const ModalTitle = ({ children }: { children: ReactNode }) => (
  <h2 className={styles.title}>{children}</h2>
);

const ModalClose = ({ onClose, children }: { onClose: () => void; children: ReactNode }) => (
  <button className={styles.close} onClick={onClose} aria-label="닫기">
    {children}
  </button>
);

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Close = ModalClose;
