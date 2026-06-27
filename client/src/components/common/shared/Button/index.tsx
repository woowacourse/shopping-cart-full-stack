import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";
import Text from "@components/common/shared/Text";

interface ButtonStyleProps {
  fullWidth?: boolean;
  rounded?: boolean;
  iconOnly?: boolean;
  variant?: "solid" | "outline" | "ghost";
  intent?: "primary" | "secondary";
  size?: "md" | "lg";
}

interface ButtonProps extends React.ComponentProps<"button">, ButtonStyleProps {}

const TYPOGRAPH_MAP = {
  lg: "body1",
  md: "body2",
} as const;

const TEXT_COLOR_MAP = {
  solid: COLOR_PALETTE.white,
  outline: COLOR_PALETTE["gray-300"],
  ghost: COLOR_PALETTE.black,
} as const;

const BG_COLOR_MAP = {
  solid: {
    primary: COLOR_PALETTE.black,
    secondary: COLOR_PALETTE["gray-900"],
  },
  outline: {
    primary: COLOR_PALETTE.white,
    secondary: COLOR_PALETTE.white,
  },
  ghost: {
    primary: "transparent",
    secondary: "transparent",
  },
} as const;

const PADDING_MAP = {
  lg: "1.5rem",
  md: "1rem",
} as const;

const ICON_ONLY_WIDTH_MAP = {
  lg: "1.75rem",
  md: "1.5rem",
};

export default function Button({
  fullWidth = false,
  rounded = false,
  iconOnly = false,
  variant = "solid",
  intent = "primary",
  size = "lg",
  children,
  ...props
}: ButtonProps) {
  return iconOnly ? (
    <IconButtonWrapper size={size} {...props}>
      {children}
    </IconButtonWrapper>
  ) : (
    <ButtonWrapper fullWidth={fullWidth} variant={variant} intent={intent} rounded={rounded} size={size} {...props}>
      <Text typograph={TYPOGRAPH_MAP[size]} color={TEXT_COLOR_MAP[variant]}>
        {children}
      </Text>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button<Required<Omit<ButtonStyleProps, "iconOnly">>>`
  background-color: ${({ variant, intent }) => BG_COLOR_MAP[variant][intent]};
  color: ${COLOR_PALETTE.white};
  font-weight: 700;
  font-size: 1rem;
  line-height: 1rem;
  padding-block: ${({ size }) => PADDING_MAP[size]};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  ${({ variant }) => variant === "outline" && `border: 1px solid  ${COLOR_PALETTE.border}`};
  border-radius: ${({ rounded }) => (rounded ? "5px" : 0)};

  :disabled {
    background-color: ${COLOR_PALETTE.disabled};
    border: none;
  }
`;

const IconButtonWrapper = styled.button<Required<Pick<ButtonStyleProps, "size">>>`
  width: ${({ size }) => ICON_ONLY_WIDTH_MAP[size]};
  aspect-ratio: 1/1;
`;
