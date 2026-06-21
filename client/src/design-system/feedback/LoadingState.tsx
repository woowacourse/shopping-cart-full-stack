import styled from '@emotion/styled';

import {theme} from '../foundation/theme.js';
import {FeedbackStateLayout} from './FeedbackStateLayout.js';

export const LoadingState = () => {
  return (
    <FeedbackStateLayout>
      <LoadingSpinner />
    </FeedbackStateLayout>
  );
};

const LoadingSpinner = styled.span`
  width: 32px;
  height: 32px;

  border: 3px solid ${theme.colors.gray100};
  border-top-color: ${theme.colors.black};
  border-radius: ${theme.radius[999]};

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
