import {AsyncStateView, EmptyState, ErrorState, LoadingState, Typo} from '../../design-system/index.js';

import {PageIntro} from '../../layout/PageIntro.js';
import {ScreenLayout} from '../../layout/ScreenLayout.js';

import {CartOrderAction} from '../components/cart-page/CartOrderAction.js';
import {CartSuccessContent} from '../components/cart-page/CartSuccessContent.js';

import {useCart} from '../hooks/useCart.js';
import type {CartItemsState} from '../domain/types.js';

function getCartPageStatus(state: CartItemsState) {
  if (state.status === 'success' && state.items.length === 0) return 'empty';
  return state.status;
}

export const CartPage = () => {
  const {cartItemsState, loadCartItems} = useCart();
  const status = getCartPageStatus(cartItemsState);

  const cartDescription =
    status === 'success' ? `현재 ${cartItemsState.items.length}종류의 상품이 담겨있습니다.` : null;

  return (
    <ScreenLayout
      header={
        <Typo as='span' color='white' variant='headline' weight='bold'>
          SHOP
        </Typo>
      }
      bottomButton={<CartOrderAction />}
    >
      <PageIntro title='장바구니' description={cartDescription} />
      <AsyncStateView
        emptyFallback={<EmptyState message='장바구니에 담은 상품이 없습니다.' />}
        errorFallback={<ErrorState message={cartItemsState.errorMessage} onAction={loadCartItems} />}
        loadingFallback={<LoadingState />}
        status={status}
      >
        <CartSuccessContent />
      </AsyncStateView>
    </ScreenLayout>
  );
};
