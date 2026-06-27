import styled from "@emotion/styled";
import type { CSSProperties, ElementType, ReactNode } from "react";

export interface FlexProps {
  as?: ElementType;
  direction?: CSSProperties["flexDirection"];
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  gap?: number;
  wrap?: boolean;
  flex?: CSSProperties["flex"];
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Flex({
  as,
  direction = "row",
  align,
  justify,
  gap = 0,
  wrap = false,
  flex,
  children,
  className,
  style,
}: FlexProps) {
  return (
    <StyledFlex
      as={as}
      $direction={direction}
      $align={align}
      $justify={justify}
      $gap={gap}
      $wrap={wrap}
      $flex={flex}
      className={className}
      style={style}
    >
      {children}
    </StyledFlex>
  );
}

const StyledFlex = styled.div<{
  $direction: CSSProperties["flexDirection"];
  $align?: CSSProperties["alignItems"];
  $justify?: CSSProperties["justifyContent"];
  $gap?: number;
  $wrap?: boolean;
  $flex?: CSSProperties["flex"];
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  ${({ $align }) => $align && `align-items: ${$align};`}
  ${({ $justify }) => $justify && `justify-content: ${$justify};`}
  gap: ${({ $gap }) => `${$gap}px`};
  ${({ $wrap }) => $wrap && "flex-wrap: wrap;"}
  ${({ $flex }) => $flex !== undefined && `flex: ${$flex};`}
`;
