import type { ReactNode } from 'react';
import Spinner from '../../components/Spinner';
import styled from '@emotion/styled';

interface CouponContentProps {
  children: ReactNode;
  error: Error | null;
  isLoading: boolean;
}

const CouponContent = ({ children, error, isLoading }: CouponContentProps) => {
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
        쿠폰 정보를 불러오지 못했습니다.
      </StatusMessage>
    );
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
  font-weight: 400;
  font-size: 1rem;
`;

export default CouponContent;
