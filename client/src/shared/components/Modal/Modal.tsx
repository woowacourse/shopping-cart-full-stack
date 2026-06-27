import { useRef, type ReactNode } from "react";
import { useModalBehavior } from "./useModalBehavior";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { ModalContext } from "./ModalContext";
import { ModalHeader } from "./ModalHeader";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { Stack } from "../layout";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
}

function ModalContentRoot({
  onClose,
  ariaLabel,
  children,
}: Omit<ModalProps, "isOpen">) {
  const contentRef = useRef<HTMLDivElement>(null);
  useModalBehavior(contentRef, onClose);

  return createPortal(
    <Overlay onClick={onClose}>
      <Content
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContext.Provider value={{ onClose }}>
          <Stack gap={16}>{children}</Stack>
        </ModalContext.Provider>
      </Content>
    </Overlay>,
    document.body,
  );
}

function ModalGate(props: ModalProps) {
  if (!props.isOpen) return null;
  return <ModalContentRoot {...props} />;
}

export const Modal = Object.assign(ModalGate, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 24px;
  box-sizing: border-box;
  outline: none;
`;
