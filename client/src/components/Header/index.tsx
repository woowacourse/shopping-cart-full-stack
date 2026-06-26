import { css } from "@emotion/react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import ChevronLeft from "../../assets/chevron-left.svg?react";
import Button from "../Button";

interface HeaderProps {
  children: ReactNode;
}

interface HeaderTitleProps {
  children: ReactNode;
}

function Title({ children }: HeaderTitleProps) {
  return <span css={titleStyle}>{children}</span>;
}

function BackButton() {
  const navigate = useNavigate();
  return (
    <button css={iconStyle} onClick={() => navigate(-1)} aria-label="뒤로 가기">
      <ChevronLeft />
    </button>
  );
}

interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

function ResetButton({ onClick, disabled = false }: ResetButtonProps) {
  return (
    <Button variant="secondary" onClick={onClick} disabled={disabled} fit>
      장바구니 되돌리기
    </Button>
  );
}

function Header({ children }: HeaderProps) {
  return <header css={headerStyle}>{children}</header>;
}

Header.Title = Title;
Header.BackButton = BackButton;
Header.ResetButton = ResetButton;

export default Header;

const headerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #111;
  color: #fff;
  flex-shrink: 0;
  height: 64px;
`;

const titleStyle = css`
  font-size: 20px;
  font-weight: 900;
  line-height: 16px;
`;

const iconStyle = css`
  font-size: 20px;
  cursor: pointer;
  background: transparent;
  border: none;
  color: #fff;
  padding: 0;
`;
