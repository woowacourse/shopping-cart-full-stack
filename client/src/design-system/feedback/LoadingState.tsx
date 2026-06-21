import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {theme} from '../foundation/theme.js';
import {FeedbackStateLayout} from './FeedbackStateLayout.js';

export const LoadingState = () => {
  return (
    <FeedbackStateLayout>
      <LoadingSpinner />
    </FeedbackStateLayout>
  );
};

interface LoadingOverlayProps {
  children: ReactNode;
}

export const LoadingOverlay = ({children}: LoadingOverlayProps) => {
  return <Overlay>{children}</Overlay>;
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

const Overlay = styled.div`
  position: absolute;
  z-index: 1;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.65);
`;
