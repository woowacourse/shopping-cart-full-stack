import styled from '@emotion/styled';

import {Spinner} from '../../../design-system/index.js';

export const CartLoadingView = () => {
  return (
    <CenteredStateArea aria-label='장바구니를 불러오는 중입니다.' role='status'>
      <Spinner />
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
