import {useNavigate} from 'react-router-dom';

import {Button} from '../../../design-system/index.js';
import {createPreorder} from '../../../order/api/orderApi.js';
import {getTotalPrice} from '../../domain/cartSelectors.js';
import {useCart} from '../../hooks/useCart.js';

export const CartOrderAction = () => {
  const navigate = useNavigate();
  const {cartItemsState, selectedIds} = useCart();
  const totalPrice = getTotalPrice({items: cartItemsState.items, selectedIds});
  const isPaymentButtonDisabled = totalPrice === 0;

  const goToOrderPreview = async () => {
    const {preorderId} = await createPreorder(selectedIds);

    navigate(`/order-preview/${preorderId}`);
  };

  return (
    <Button disabled={isPaymentButtonDisabled} onClick={goToOrderPreview}>
      주문 확인
    </Button>
  );
};
