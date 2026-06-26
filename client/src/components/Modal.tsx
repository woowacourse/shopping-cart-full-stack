import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import closeIcon from '../../src/assets/close.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  const titleId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    contentRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={onClose}>
      <Content
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id={titleId}>{title}</Title>
          <CloseButton type="button" aria-label="닫기" onClick={onClose}>
            <img src={closeIcon} alt="close-icon" />
          </CloseButton>
        </Header>

        <Body>{children}</Body>

        {footer && <Footer>{footer}</Footer>}
      </Content>
    </Overlay>,
    document.body,
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.15s ease-out;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 32px);
  padding: 24px 32px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
  animation: ${slideUp} 0.2s ease-out;
  outline: none;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0a0d13;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -8px;
  border-radius: 8px;
  color: #0a0d13;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 20px;
`;

const Footer = styled.footer`
  margin-top: 24px;
`;
