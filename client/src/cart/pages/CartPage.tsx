import {AsyncStateView, Typo} from '../../design-system/index.js';

import {CartItemList} from '../components/cart-item/CartItemList.js';
import {CartEmptyView} from '../components/cart-page/CartEmptyView.js';
import {CartErrorView} from '../components/cart-page/CartErrorView.js';
import {CartLoadingView} from '../components/cart-page/CartLoadingView.js';
import {CartOrderAction} from '../components/cart-page/CartOrderAction.js';
import {PaymentSummary} from '../components/cart-page/PaymentSummary.js';
import {PageIntro} from '../../layout/PageIntro.js';
import {ScreenLayout} from '../../layout/ScreenLayout.js';

import {useCart} from '../hooks/useCart.js';
import {getSelectedOrderAmount, getShippingFee, getTotalPrice} from '../domain/cartSelectors.js';
import type {CartItemsState} from '../domain/types.js';

export const CartPage = () => {
  const {cartItemsState, loadCartItems} = useCart();
  const status = getCartPageStatus(cartItemsState);

  return (
    <ScreenLayout
      header={
        <Typo as='span' color='white' variant='headline' weight='bold'>
          SHOP
        </Typo>
      }
      bottomButton={<CartOrderAction />}
    >
      <PageIntro
        title='장바구니'
        description={status === 'success' ? `현재 ${cartItemsState.items.length}종류의 상품이 담겨있습니다.` : null}
      />
      <AsyncStateView
        emptyFallback={<CartEmptyView />}
        errorFallback={<CartErrorView errorMessage={cartItemsState.errorMessage} onRetry={loadCartItems} />}
        loadingFallback={<CartLoadingView />}
        status={status}
      >
        <CartPageContent />
      </AsyncStateView>
    </ScreenLayout>
  );
};

function CartPageContent() {
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
}

function getCartPageStatus(state: CartItemsState) {
  if (state.status === 'success' && state.items.length === 0) return 'empty';

  return state.status;
}
