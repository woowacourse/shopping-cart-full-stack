import styled from '@emotion/styled';

import {theme} from '../foundation/theme.js';

export const LoadingState = () => {
  return (
    <Container role='status'>
      <LoadingSpinner />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const LoadingSpinner = styled.span`
  width: 32px;
  height: 32px;

  border: 3px solid ${theme.colors.gray100};
  border-top-color: ${theme.colors.black};
  border-radius: ${theme.radius[999]};

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
