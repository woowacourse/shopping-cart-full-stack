import styled from "@emotion/styled";

export const StyledColumn = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 0 }) => `${gap}px`};
  align-items: center;
`;
