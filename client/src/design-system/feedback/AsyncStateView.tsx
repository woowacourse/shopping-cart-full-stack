import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {LoadingOverlay} from './LoadingState.js';

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
  loadingFallback,
  status,
}: AsyncStateViewProps) => {
  if (status === 'error') {
    return <>{errorFallback}</>;
  }

  if (status === 'empty') {
    return <>{emptyFallback}</>;
  }

  return (
    <Container>
      {children}
      {status === 'loading' && <LoadingOverlay>{loadingFallback}</LoadingOverlay>}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
`;
