import {useNavigate} from 'react-router-dom';

import {Button, FixedBottomAction} from '../../../design-system/index.js';
import {getTotalPrice} from '../../domain/cartSelectors.js';
import {useCart} from '../../hooks/useCart.js';

export const CartOrderAction = () => {
  const navigate = useNavigate();
  const {cartItemsState, selectedIds} = useCart();
  const totalPrice = getTotalPrice({items: cartItemsState.items, selectedIds});
  const isPaymentButtonDisabled = totalPrice === 0;

  return (
    <FixedBottomAction>
      <Button disabled={isPaymentButtonDisabled} onClick={() => navigate('/order-confirm')}>
        주문 확인
      </Button>
    </FixedBottomAction>
  );
};
