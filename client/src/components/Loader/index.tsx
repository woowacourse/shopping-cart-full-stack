import { css, keyframes } from "@emotion/react";

interface LoaderProps {
  /** 점 하나의 지름(px) */
  size?: number;
  color?: string;
}

/** 점 3개가 순차로 통통 튀는 로딩 인디케이터(ellipsis/bouncing dots). */
export default function Loader({ size = 6, color = "currentColor" }: LoaderProps) {
  return (
    <span role="status" aria-label="로딩 중" css={loaderStyle}>
      <span css={dotStyle(size, color, 0)} />
      <span css={dotStyle(size, color, 0.15)} />
      <span css={dotStyle(size, color, 0.3)} />
    </span>
  );
}

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
`;

const loaderStyle = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const dotStyle = (size: number, color: string, delaySec: number) => css`
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background-color: ${color};
  animation: ${bounce} 0.9s ease-in-out ${delaySec}s infinite;
`;
