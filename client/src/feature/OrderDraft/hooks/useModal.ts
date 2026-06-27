import { useCallback, useState, type ReactNode } from 'react';

export const useModal = (
  renderModal: (controls: { close: () => void }) => ReactNode,
) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const modal = isOpen ? renderModal({ close }) : null;

  return {
    modal,
    isOpen,
    open,
    close,
  };
};
