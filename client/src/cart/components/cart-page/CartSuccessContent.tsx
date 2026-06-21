import {CartItemList} from '../cart-item/CartItemList.js';
import {PaymentSummary} from './PaymentSummary.js';

import {getSelectedOrderAmount, getShippingFee, getTotalPrice} from '../../domain/cartSelectors.js';
import {useCart} from '../../hooks/useCart.js';

export const CartSuccessContent = () => {
  const {cartItemsState, changeCartItemQuantity, changeSelectedCartItemIds, removeCartItem, selectedIds} = useCart();
  const cartSelection = {items: cartItemsState.items, selectedIds};
  const selectedOrderAmount = getSelectedOrderAmount(cartSelection);
  const shippingFee = getShippingFee(cartSelection);
  const totalPrice = getTotalPrice(cartSelection);

  return (
    <>
      <CartItemList
        items={cartItemsState.items}
        selectedIds={selectedIds}
        onChangeQuantity={changeCartItemQuantity}
        onChangeSelectedIds={changeSelectedCartItemIds}
        onDelete={removeCartItem}
      />
      <PaymentSummary selectedOrderAmount={selectedOrderAmount} shippingFee={shippingFee} totalPrice={totalPrice} />
    </>
  );
};
