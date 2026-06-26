import { useState, type ReactNode } from 'react';
import Modal from './Modal';
import { ModalContext } from './ModalContext';

interface ModalEntry<T> {
    id: string;
    render: (close: (result: T) => void) => ReactNode;
    resolve: (result: T) => void;
}

export function ModalProvider({ children }: { children: ReactNode }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stack, setStack] = useState<ModalEntry<any>[]>([]);

    const open = <T,>(render: (close: (result: T) => void) => ReactNode): Promise<T> => {
        const id = crypto.randomUUID();

        return new Promise<T>((resolve) => {
            setStack((prev) => [...prev, { id, render, resolve }]);
        });
    };

    // modal이 close될 때 호출할 함수, stack에서 제거시킨 뒤 resolve
    const closeModal = (id: string, result: unknown) => {
        const target = stack.find((entry) => entry.id === id);
        setStack((prev) => prev.filter((entry) => entry.id !== id));
        target?.resolve(result);
    };
    return (
        <ModalContext.Provider value={{ open }}>
            {children}
            {stack.map((entry) => (
                <Modal
                    key={entry.id}
                    onClose={() => closeModal(entry.id, undefined)}
                    render={() => entry.render((result) => closeModal(entry.id, result))}
                />
            ))}
        </ModalContext.Provider>
    );
}
