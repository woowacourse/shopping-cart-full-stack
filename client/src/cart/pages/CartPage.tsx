import styled from '@emotion/styled';

import {AsyncStateView} from '../../design-system/index.js';

import {CartItemList} from '../components/cart-item/CartItemList.js';
import {CartEmptyView} from '../components/cart-page/CartEmptyView.js';
import {CartErrorView} from '../components/cart-page/CartErrorView.js';
import {CartLoadingView} from '../components/cart-page/CartLoadingView.js';
import {CartOrderAction} from '../components/cart-page/CartOrderAction.js';
import {CartPageHeader} from '../components/cart-page/CartPageHeader.js';
import {PaymentSummary} from '../components/cart-page/PaymentSummary.js';
import {Header} from '../components/layout/Header.js';

import {useCart} from '../hooks/useCart.js';
import {getSelectedOrderAmount, getShippingFee, getTotalPrice} from '../domain/cartSelectors.js';
import type {CartItemsState} from '../domain/types.js';

export const CartPage = () => {
  const {cartItemsState, loadCartItems} = useCart();
  const status = getCartPageStatus(cartItemsState);
  const isOrderActionVisible = status === 'success' || status === 'empty';

  return (
    <>
      <Header title='SHOP' />
      <Main>
        <CartPageHeader itemCount={status === 'success' ? cartItemsState.items.length : null} />
        <AsyncStateView
          emptyFallback={<CartEmptyView />}
          errorFallback={<CartErrorView errorMessage={cartItemsState.errorMessage} onRetry={loadCartItems} />}
          loadingFallback={<CartLoadingView />}
          status={status}
        >
          <CartPageContent />
        </AsyncStateView>
        {isOrderActionVisible && <CartOrderAction />}
      </Main>
    </>
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

const Main = styled.main`
  display: flex;
  min-height: calc(100dvh - 64px);
  box-sizing: border-box;
  flex-direction: column;
  padding: 36px 24px;
  padding-bottom: calc(64px + 32px);
`;
