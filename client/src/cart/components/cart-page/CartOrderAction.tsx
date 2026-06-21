import {useNavigate} from 'react-router-dom';

import {Button} from '../../../design-system/index.js';
import {getTotalPrice} from '../../domain/cartSelectors.js';
import {useCart} from '../../hooks/useCart.js';

export const CartOrderAction = () => {
  const navigate = useNavigate();
  const {cartItemsState, selectedIds} = useCart();
  const totalPrice = getTotalPrice({items: cartItemsState.items, selectedIds});
  const isPaymentButtonDisabled = totalPrice === 0;

  return (
    <Button disabled={isPaymentButtonDisabled} onClick={() => navigate('/order-preview')}>
      주문 확인
    </Button>
  );
};
