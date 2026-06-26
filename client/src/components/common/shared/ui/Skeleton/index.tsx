import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  circle?: boolean;
}

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Skeleton = styled.div<SkeletonProps>`
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "1rem"};
  border-radius: ${(props) =>
    props.circle ? "50%" : (props.borderRadius ?? "0.25rem")};
  background-image: linear-gradient(
    90deg,
    ${COLOR_PALETTE["skeleton-base"]} 25%,
    ${COLOR_PALETTE["skeleton-highlight"]} 37%,
    ${COLOR_PALETTE["skeleton-base"]} 63%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export default Skeleton;
