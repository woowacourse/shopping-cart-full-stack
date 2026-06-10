import styled from '@emotion/styled';

import {theme} from '../foundation/theme.js';

export const Spinner = () => {
  return (
    <Container aria-label='로딩 중...'>
      <Circle aria-hidden='true' />
    </Container>
  );
};

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.span`
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
