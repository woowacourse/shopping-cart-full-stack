import styled from '@emotion/styled';
import type {MouseEventHandler, ReactNode} from 'react';

import {Button} from '../components/Button.js';
import {Typo} from '../components/Typo.js';

interface ErrorStateProps {
  message: ReactNode;
  onAction: MouseEventHandler<HTMLButtonElement>;
}

export const ErrorState = ({message, onAction}: ErrorStateProps) => {
  return (
    <Container>
      <ErrorMessage as='p' color='gray900' role='alert' variant='body' weight='medium'>
        {message}
      </ErrorMessage>
      <Button onClick={onAction}>다시 시도</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const ErrorMessage = styled(Typo)`
  text-align: center;
`;
