import { css } from "@emotion/react";
import type { ReactNode } from "react";
import MinusIcon from "../../assets/minus.svg?react";
import PlusIcon from "../../assets/plus.svg?react";
import Button from "../Button";

interface ItemProps {
  disabled?: boolean;
  children: ReactNode;
}

function Item({ disabled = false, children }: ItemProps) {
  return <div css={[itemStyle, disabled && disabledStyle]}>{children}</div>;
}

function Header({ children }: { children: ReactNode }) {
  return <div css={headerStyle}>{children}</div>;
}

function Main({ children }: { children: ReactNode }) {
  return <div css={mainStyle}>{children}</div>;
}

function Thumbnail({ src, alt = "" }: { src: string; alt?: string }) {
  return <img css={thumbnailStyle} src={src} alt={alt} />;
}

function TextXl({ children }: { children: ReactNode }) {
  return <span className="typo-xl-b">{children}</span>;
}

function TextMd({ children }: { children: ReactNode }) {
  return <span className="typo-md-b">{children}</span>;
}

function TextSm({ children }: { children: ReactNode }) {
  return <span className="typo-sm-r">{children}</span>;
}

interface StepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
}

function Stepper({ value, onDecrease, onIncrease, decreaseDisabled = false, increaseDisabled = false }: StepperProps) {
  return (
    <div css={stepperStyle}>
      <Button variant="icon" onClick={onDecrease} disabled={decreaseDisabled}>
        <MinusIcon />
      </Button>
      <span className="typo-sm-r" css={stepperValueStyle}>
        {value}
      </span>
      <Button variant="icon" onClick={onIncrease} disabled={increaseDisabled}>
        <PlusIcon />
      </Button>
    </div>
  );
}

Item.Header = Header;
Item.Main = Main;
Item.Thumbnail = Thumbnail;
Item.Stepper = Stepper;
Item.TextXl = TextXl;
Item.TextMd = TextMd;
Item.TextSm = TextSm;

export default Item;

const itemStyle = css`
  padding: 12px 0;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const disabledStyle = css`
  opacity: 0.4;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const mainStyle = css`
  display: flex;
  gap: 24px;
`;

const thumbnailStyle = css`
  width: 112px;
  height: 112px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  flex-shrink: 0;
`;

const stepperStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
`;

const stepperValueStyle = css`
  min-width: 20px;
  text-align: center;
`;
