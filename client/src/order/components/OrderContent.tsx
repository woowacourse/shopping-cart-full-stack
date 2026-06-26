import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import Spinner from '../../components/Spinner';

interface OrderContentProps {
  children: ReactNode;
  error: Error | null;
  isLoading: boolean;
}

const OrderContent = ({
  children,
  error,
  isLoading,
}: OrderContentProps) => {
  if (isLoading) {
    return (
      <LoadingState role="status">
        <Spinner aria-hidden="true" />
      </LoadingState>
    );
  }

  if (error) {
    return <StatusMessage role="alert">{error.message}</StatusMessage>;
  }

  return children;
};

const LoadingState = styled.div`
  min-height: 30rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusMessage = styled.p`
  min-height: 30rem;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0;
  font-size: 1rem;
  font-weight: 400;
`;

export default OrderContent;
