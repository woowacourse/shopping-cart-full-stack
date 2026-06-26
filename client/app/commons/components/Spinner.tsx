import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export default function Spinner() {
  return (
    <SpinnerWrapper>
      <SpinnerCircle />
    </SpinnerWrapper>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 4rem 0;
`;

const SpinnerCircle = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e8e8e8;
  border-top-color: #333;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
