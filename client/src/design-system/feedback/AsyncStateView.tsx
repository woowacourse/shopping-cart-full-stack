import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {LoadingOverlay, LoadingState} from './LoadingState.js';

export type AsyncStatus = 'loading' | 'error' | 'empty' | 'success';

type AsyncStateViewProps = {
  children: ReactNode;
  emptyFallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingFallback?: ReactNode;
  status: AsyncStatus;
};

export const AsyncStateView = ({
  children,
  emptyFallback,
  errorFallback,
  loadingFallback = <LoadingState />,
  status,
}: AsyncStateViewProps) => {
  if (status === 'error') {
    return <>{errorFallback}</>;
  }

  if (status === 'empty') {
    return <>{emptyFallback}</>;
  }

  if (status === 'loading') {
    return (
      <Container>
        {children}
        <LoadingOverlay>{loadingFallback}</LoadingOverlay>
      </Container>
    );
  }

  return <>{children}</>;
};

const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
`;
