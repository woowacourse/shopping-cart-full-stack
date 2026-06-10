import styled from '@emotion/styled';

import {Typo} from '../../../design-system/index.js';

export const CartEmptyView = () => {
  return (
    <CenteredStateArea>
      <Typo as='p' color='gray900' variant='body' weight='medium'>
        장바구니에 담은 상품이 없습니다.
      </Typo>
    </CenteredStateArea>
  );
};

const CenteredStateArea = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
