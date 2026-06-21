import {PageIntro} from '../../../../shared/layout/PageIntro.js';
import {useCart} from '../../hooks/useCart.js';
import {getSelectedOrderAmount, getShippingFee, getTotalPrice} from '../../domain/cartSelectors.js';
import {CartItemList} from '../cart-item/CartItemList.js';
import {PaymentSummary} from './PaymentSummary.js';

export const CartSuccessView = () => {
  const {cartItemsState, changeCartItemQuantity, changeSelectedCartItemIds, removeCartItem, selectedIds} = useCart();
  const cartSelection = {items: cartItemsState.items, selectedIds};
  const selectedOrderAmount = getSelectedOrderAmount(cartSelection);
  const shippingFee = getShippingFee(cartSelection);
  const totalPrice = getTotalPrice(cartSelection);

  return (
    <>
      <PageIntro title='장바구니' description={`현재 ${cartItemsState.items.length}종류의 상품이 담겨있습니다.`} />
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
