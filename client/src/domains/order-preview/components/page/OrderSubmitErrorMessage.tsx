import styled from '@emotion/styled';

import {Typo} from '../../../../design-system/index.js';
import {useOrderPreviewPage} from '../../hooks/useOrderPreviewPage.js';

export const OrderSubmitErrorMessage = () => {
  const {orderSubmit} = useOrderPreviewPage();

  if (!orderSubmit.errorMessage) return null;

  return (
    <Message as='p' color='gray900' variant='caption' weight='medium'>
      {orderSubmit.errorMessage}
    </Message>
  );
};

const Message = styled(Typo)`
  margin-top: 16px;
  text-align: center;
`;
