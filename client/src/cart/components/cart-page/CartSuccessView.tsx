import {PageIntro} from '../../../layout/PageIntro.js';
import {useCart} from '../../hooks/useCart.js';
import {CartSuccessContent} from './CartSuccessContent.js';

export const CartSuccessView = () => {
  const {cartItemsState} = useCart();

  return (
    <>
      <PageIntro title='장바구니' description={`현재 ${cartItemsState.items.length}종류의 상품이 담겨있습니다.`} />
      <CartSuccessContent />
    </>
  );
};
