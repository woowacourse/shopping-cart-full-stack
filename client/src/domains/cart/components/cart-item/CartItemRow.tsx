import styled from '@emotion/styled';

import {Checkbox, NumericSpinner, Typo, fontWeights, theme, typography} from '../../../../design-system/index.js';
import {ProductItemLayout} from '../../../../layout/ProductItemLayout.js';
import type {CartItem, CartItemId} from '../../domain/types.js';

type CartItemRowProps = {
  cartItem: CartItem;
  checked: boolean;
  onChangeQuantity: (cartItemId: CartItemId, quantity: CartItem['quantity']) => void | Promise<void>;
  onDelete: (cartItemId: CartItemId) => void;
  onToggle: (cartItemId: CartItemId) => void;
};

export const CartItemRow = ({cartItem, checked, onChangeQuantity, onDelete, onToggle}: CartItemRowProps) => {
  const {id, productInfo, quantity} = cartItem;

  return (
    <CartProductItemLayout
      header={
        <CartItemHeader>
          <Checkbox checked={checked} onChange={() => onToggle(id)} />
          <DeleteButton
            onClick={() => {
              onDelete(id);
            }}
            type='button'
          >
            삭제
          </DeleteButton>
        </CartItemHeader>
      }
      image={<img alt={productInfo.name} src={productInfo.imageUrl} />}
    >
      <ProductInfo>
        <TextGroup>
          <Typo as='strong' variant='caption' weight='medium'>
            {productInfo.name}
          </Typo>
          <Typo as='strong' color='black' variant='display' weight='bold'>
            {productInfo.price.toLocaleString('ko-KR')}원
          </Typo>
        </TextGroup>
        <NumericSpinner
          max={99}
          min={1}
          onChange={(nextQuantity) => {
            void onChangeQuantity(id, nextQuantity);
          }}
          value={quantity}
        />
      </ProductInfo>
    </CartProductItemLayout>
  );
};

const CartProductItemLayout = styled(ProductItemLayout)`
  padding-bottom: 20px;
`;

const CartItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductInfo = styled.div`
  display: flex;
  min-width: 0;
  height: 112px;
  flex-direction: column;
  justify-content: space-around;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DeleteButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${theme.colors.blackAlpha10};
  border-radius: ${theme.radius[4]};
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  cursor: pointer;
  font: inherit;
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
  white-space: nowrap;
`;
