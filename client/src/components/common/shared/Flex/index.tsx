import styled from "@emotion/styled";

interface FlexStyleProps {
  direction?: React.CSSProperties["flexDirection"];
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  gap?: number;
}

const Flex = styled.div<FlexStyleProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  gap: ${({ gap }) => `${gap}px`};
`;

export default Flex;
