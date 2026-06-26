import { COLOR_PALETTE } from "@/styles/colorPalette";
import styled from "@emotion/styled";

interface WeakButtonProps {
  fullWidth?: boolean;
}

const WeakButton = styled.button<WeakButtonProps>`
  border: 1px solid ${COLOR_PALETTE.border};
  padding: 1rem 2rem;
  border-radius: 0.25rem;
  background-color: ${COLOR_PALETTE.white};
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 0.9375rem;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "fit-content")};
`;

export default WeakButton;
