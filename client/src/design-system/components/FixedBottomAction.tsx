import styled from '@emotion/styled';
import type {HTMLAttributes, ReactNode} from 'react';

import {theme} from '../foundation/theme.js';

type FixedBottomActionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const FixedBottomAction = ({children, ...props}: FixedBottomActionProps) => {
  return <Container {...props}>{children}</Container>;
};

const Container = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  max-width: 430px;
  margin: 0 auto;
  background: ${theme.colors.white};

  & > button {
    width: 100%;
  }
`;
