import styled from '@emotion/styled';
import { createContext, useContext, useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import CloseIcon from '../Icons/CloseIcon';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

interface ModalTitleProps {
  children: ReactNode;
}

interface ModalContextValue {
  onClose: () => void;
  titleId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Modal 하위 컴포넌트는 Modal 내부에서 사용해야 합니다.');
  }

  return context;
};

const ModalRoot = ({ children, isOpen, onClose }: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext value={{ onClose, titleId }}>
      <Backdrop onClick={onClose}>
        <Dialog
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </Dialog>
      </Backdrop>
    </ModalContext>
  );
};

const ModalTitle = ({ children }: ModalTitleProps) => {
  const { titleId } = useModalContext();

  return <Title id={titleId}>{children}</Title>;
};

const ModalCloseButton = () => {
  const { onClose } = useModalContext();

  return (
    <CloseButton type="button" aria-label="닫기" onClick={onClose}>
      <CloseIcon />
    </CloseButton>
  );
};

const Backdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: #00000059;
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 24rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 1.5rem 2rem;
`;

const ModalFooter = styled.footer`
  padding: 0 2rem 1.5rem;
`;

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;
