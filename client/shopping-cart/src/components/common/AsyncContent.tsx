import type { ReactNode } from 'react';

type Props = {
  isLoading: boolean;
  isError: boolean;
  loadingFallback: ReactNode;
  errorFallback: ReactNode;
  children: ReactNode;
};

const AsyncContent = ({ isLoading, isError, loadingFallback, errorFallback, children }: Props) => {
  if (isLoading) return <>{loadingFallback}</>;
  if (isError) return <>{errorFallback}</>;
  return <>{children}</>;
};

export default AsyncContent;
