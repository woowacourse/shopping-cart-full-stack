import { createContext, useContext } from "react";

interface ModalContextValue {
    onClose: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext(): ModalContextValue {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("Modal.Header/Body/Footer 는 <Modal> 안에서만 쓸 수 있습니다.");
    }
    return context;
}