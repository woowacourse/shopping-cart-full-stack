import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";

interface ButtonProps {
  fullWidth?: boolean;
}

const Button = styled.button<ButtonProps>`
  background-color: ${COLOR_PALETTE.black};
  color: ${COLOR_PALETTE.white};
  font-weight: 700;
  font-size: 1rem;
  line-height: 1rem;
  padding-block: 1.5rem;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  :disabled {
    background-color: ${COLOR_PALETTE.disabled};
    border: none;
  }
`;

export default Button;
