import { css } from "@emotion/react";
import type { ReactNode } from "react";
import XmarkIcon from "../../assets/xmark.svg?react";
import Button from "../Button";

interface ModalProps {
  width?: string;
  height?: string;
  onDimmedClick?: () => void;
  children: ReactNode;
}

function Modal({ width = "100%", height = "auto", onDimmedClick, children }: ModalProps) {
  return (
    <div css={dimmedStyle} onClick={onDimmedClick}>
      <div css={[containerStyle, css({ width, height })]} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <div css={headerStyle}>{children}</div>;
}

function Main({ children }: { children: ReactNode }) {
  return <div css={mainStyle}>{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="icon" css={closeButtonStyle} onClick={onClick} aria-label="닫기">
      <XmarkIcon />
    </Button>
  );
}

Modal.Header = Header;
Modal.Main = Main;
Modal.Footer = Footer;
Modal.CloseButton = CloseButton;

export default Modal;

const closeButtonStyle = css`
  border: none;
`;

const dimmedStyle = css`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  z-index: 1000;
`;

const containerStyle = css`
  padding: 32px 24px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const headerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const mainStyle = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
