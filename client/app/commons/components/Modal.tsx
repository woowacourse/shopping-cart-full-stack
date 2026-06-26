import { useEffect, useRef } from "react";
import styled from "@emotion/styled";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Dialog ref={dialogRef}>
      <ModalContent>
        <CloseButton onClick={onClose} aria-label="닫기">
          ✕
        </CloseButton>
        {children}
      </ModalContent>
    </Dialog>
  );
}

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: #333333;
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: 100%;
`;

const Dialog = styled.dialog`
  width: 320px;
  height: 614px;
  border-radius: 8px;
  border: none;
  padding: 24px 32px;
  background: #ffffff;
  margin: auto;

  &::backdrop {
    background: #00000059;
  }
`;
