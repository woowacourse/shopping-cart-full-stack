import styled from '@emotion/styled';

import {Typo} from '../../../design-system/index.js';

type CartPageHeaderProps = {
  itemCount: number | null;
};

export const CartPageHeader = ({itemCount}: CartPageHeaderProps) => {
  return (
    <TitleArea>
      <Typo as='h1' variant='display' weight='bold'>
        장바구니
      </Typo>
      {itemCount !== null && (
        <Typo as='p' color='gray900' variant='caption' weight='medium'>
          현재 {itemCount}종류의 상품이 담겨있습니다.
        </Typo>
      )}
    </TitleArea>
  );
};

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
