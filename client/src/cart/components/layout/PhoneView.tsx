import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {theme} from '../../../design-system/index.js';

type PhoneViewProps = {
  children: ReactNode;
};

export const PhoneView = ({children}: PhoneViewProps) => {
  return (
    <Viewport>
      <Container>{children}</Container>
    </Viewport>
  );
};

const Viewport = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.gray100};
`;

const Container = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  border-right: 1px solid ${theme.colors.gray300};
  border-left: 1px solid ${theme.colors.gray300};
  background: ${theme.colors.white};
  box-shadow: 0 0 24px ${theme.colors.blackAlpha10};
`;
