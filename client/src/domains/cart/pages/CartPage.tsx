import {AsyncStateView, EmptyState, ErrorState, LoadingState, Typo} from '../../../design-system/index.js';

import {ScreenLayout} from '../../../layout/ScreenLayout.js';

import {CartOrderAction} from '../components/cart-page/CartOrderAction.js';
import {CartSuccessView} from '../components/cart-page/CartSuccessView.js';

import {useCart} from '../hooks/useCart.js';
import type {CartItemsState} from '../domain/types.js';

function getCartPageStatus(state: CartItemsState) {
  if (state.status === 'success' && state.items.length === 0) return 'empty';
  return state.status;
}

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
      <AsyncStateView
        emptyFallback={<EmptyState message='장바구니에 담은 상품이 없습니다.' />}
        errorFallback={<ErrorState message={cartItemsState.errorMessage} onAction={loadCartItems} />}
        loadingFallback={<LoadingState />}
        status={status}
      >
        <CartSuccessView />
      </AsyncStateView>
    </ScreenLayout>
  );
};
