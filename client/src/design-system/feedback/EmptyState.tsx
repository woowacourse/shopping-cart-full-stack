import type {ReactNode} from 'react';

import {Typo} from '../components/Typo.js';
import {FeedbackStateLayout} from './FeedbackStateLayout.js';

interface EmptyStateProps {
  message: ReactNode;
}

export const EmptyState = ({message}: EmptyStateProps) => {
  return (
    <FeedbackStateLayout>
      <Typo as='p' color='gray900' variant='body' weight='medium'>
        {message}
      </Typo>
    </FeedbackStateLayout>
  );
};
