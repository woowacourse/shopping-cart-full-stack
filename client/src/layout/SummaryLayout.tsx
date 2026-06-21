import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {Divider, Typo} from '../design-system/index.js';

interface SummaryLayoutProps {
  children: ReactNode;
  className?: string;
}

interface SummaryRowProps {
  left: ReactNode;
  right: ReactNode;
}

export const SummaryLayout = ({children, className}: SummaryLayoutProps) => {
  return (
    <Container className={className}>
      <Divider />
      {children}
    </Container>
  );
};

export const SummaryRow = ({left, right}: SummaryRowProps) => {
  return (
    <Row>
      <Left variant='body' weight='bold'>
        {left}
      </Left>
      <Right color='black' variant='display' weight='bold'>
        {right}
      </Right>
    </Row>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Left = styled(Typo)`
  vertical-align: middle;
`;

const Right = styled(Typo)`
  text-align: right;
  vertical-align: middle;
  white-space: nowrap;
`;
