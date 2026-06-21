import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {Typo} from '../components/Typo.js';

interface EmptyStateProps {
  message: ReactNode;
}

export const EmptyState = ({message}: EmptyStateProps) => {
  return (
    <Container>
      <Typo as='p' color='gray900' variant='body' weight='medium'>
        {message}
      </Typo>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
