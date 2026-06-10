import styled from '@emotion/styled';

import {Button, Typo} from '../../../design-system/index.js';

type CartErrorViewProps = {
  errorMessage: string;
  onRetry: () => void | Promise<void>;
};

export const CartErrorView = ({errorMessage, onRetry}: CartErrorViewProps) => {
  return (
    <CenteredStateArea>
      <ErrorMessage as='p' color='gray900' role='alert' variant='body' weight='medium'>
        {errorMessage}
      </ErrorMessage>
      <RetryButton
        onClick={() => {
          void onRetry();
        }}
      >
        다시 시도
      </RetryButton>
    </CenteredStateArea>
  );
};

const CenteredStateArea = styled.div`
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

const RetryButton = styled(Button)`
  width: 120px;
  height: 48px;
`;
