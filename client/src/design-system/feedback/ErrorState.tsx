import styled from '@emotion/styled';
import type {MouseEventHandler, ReactNode} from 'react';

import {Button} from '../components/Button.js';
import {Typo} from '../components/Typo.js';
import {FeedbackStateLayout} from './FeedbackStateLayout.js';

interface ErrorStateProps {
  actionText?: string;
  message: ReactNode;
  onAction: MouseEventHandler<HTMLButtonElement>;
}

export const ErrorState = ({actionText = '다시 시도', message, onAction}: ErrorStateProps) => {
  return (
    <FeedbackStateLayout>
      <ErrorMessage as='p' color='gray900' variant='body' weight='medium'>
        {message}
      </ErrorMessage>
      <Button onClick={onAction}>{actionText}</Button>
    </FeedbackStateLayout>
  );
};

const ErrorMessage = styled(Typo)`
  text-align: center;
`;
