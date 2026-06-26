import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import Spinner from '../../components/Spinner';

interface OrderSummaryContentProps {
  children: ReactNode;
  error: Error | null;
  isLoading: boolean;
}

const OrderSummaryContent = ({
  children,
  error,
  isLoading,
}: OrderSummaryContentProps) => {
  if (isLoading) {
    return (
      <LoadingState role="status">
        <Spinner aria-hidden="true" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <StatusMessage role="alert">
        결제 금액을 불러오지 못했습니다.
      </StatusMessage>
    );
  }

  return children;
};

const LoadingState = styled.div`
  min-height: 11.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusMessage = styled.p`
  min-height: 11.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0;
  font-weight: 400;
  font-size: 1rem;
`;

export default OrderSummaryContent;
