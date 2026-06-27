import styled from "@emotion/styled";

export const StyledRow = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: row;
  gap: ${({ gap = 0 }) => `${gap}px`};
  align-items: center;
`;
