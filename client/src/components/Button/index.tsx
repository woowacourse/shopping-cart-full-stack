import { css } from "@emotion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "icon";
type Radius = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fit?: boolean;
  radius?: Radius;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  fit = false,
  radius,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} css={[baseStyle, variantStyles[variant], fit && fitStyle, radius && radiusStyles[radius]]} {...props}>
      {children}
    </button>
  );
}

const baseStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  width: 100%;
  height: 100%;
  border-radius: 0;
  font-size: 12px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    background-color: #000;
    color: #fff;
  `,
  secondary: css`
    background-color: #fff;
    color: #000;
    border: 1px solid #e5e5e5;
  `,
  icon: css`
    background-color: #fff;
    color: #000;
    border: 1px solid #e5e5e5;
    width: 24px;
    height: 24px;
    padding: 2px;
    border-radius: 8px;
  `,
};

const radiusStyles: Record<Radius, ReturnType<typeof css>> = {
  sm: css`
    border-radius: 4px;
  `,
  md: css`
    border-radius: 8px;
  `,
  lg: css`
    border-radius: 12px;
  `,
};

const fitStyle = css`
  width: auto;
  border-radius: 4px;
  padding: 4px 8px;
`;
