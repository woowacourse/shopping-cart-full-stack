import styled from '@emotion/styled';
import type {ReactNode} from 'react';

interface FeedbackStateLayoutProps {
  children: ReactNode;
}

export const FeedbackStateLayout = ({children}: FeedbackStateLayoutProps) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  min-height: 220px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
`;
