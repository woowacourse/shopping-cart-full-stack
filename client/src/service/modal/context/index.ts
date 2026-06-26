import { createContext } from "react";

export interface ModalContextType {
  addModal: (modalComponent: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export default ModalContext;
