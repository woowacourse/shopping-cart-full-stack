import { createContext, type ReactNode } from 'react';

export interface ModalContextValue {
    open: <T>(render: (close: (result: T) => void) => ReactNode) => Promise<T>;
}

export const ModalContext = createContext<ModalContextValue | null>(null);
