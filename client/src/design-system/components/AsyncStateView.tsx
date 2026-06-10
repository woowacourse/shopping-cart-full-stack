import type {ReactNode} from 'react';

type AsyncStatus = 'loading' | 'error' | 'empty' | 'success';

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
  if (status === 'loading') {
    return <>{loadingFallback}</>;
  }

  if (status === 'error') {
    return <>{errorFallback}</>;
  }

  if (status === 'empty') {
    return <>{emptyFallback}</>;
  }

  return <>{children}</>;
};
