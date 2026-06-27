import { css } from '@emotion/react';
import { useNavigate } from 'react-router';

import PrimaryButton from '../components/common/buttons/PrimaryButton';
import CartBody from '../components/cart/CartBody';
import ProductRawSkeleton from '../components/common/ProductRawSkeleton';
import AsyncContent from '../components/common/AsyncContent';
import AppHeader from '../components/layout/AppHeader';

import useCart from '../hooks/useCart';
import { createOrderCheck } from '../apis/orderCheckApi';
import { getCart } from '../apis/cartApi';
import useCartActions from '../hooks/useCartActions';
const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, setCart, isLoading, isError } = useCart(getCart);
  const { handleSelect, handleSelectAll, handleDelete, handleQuantity } = useCartActions(setCart);

  return (
    <>
      <AppHeader>
        <h1
          css={css`
            font: var(--text-logo);
            color: var(--color-white);
          `}
        >
          SHOP
        </h1>
      </AppHeader>
      <main
        css={css`
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 36px;
          padding: 36px 24px;
          overflow-y: auto;
        `}
      >
        <AsyncContent
          isLoading={isLoading}
          isError={isError}
          loadingFallback={
            <ul
              css={css`
                list-style: none;
                margin: 0;
                padding: 0;
              `}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductRawSkeleton key={i} />
              ))}
            </ul>
          }
          errorFallback={<p>장바구니를 불러오는 데 실패했습니다.</p>}
        >
          {cart &&
            (cart.cartItems.length === 0 ? (
              <p>장바구니에 담은 상품이 없습니다.</p>
            ) : (
              <CartBody
                cart={cart}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onDelete={handleDelete}
                onChangeQuantity={handleQuantity}
              />
            ))}
        </AsyncContent>
      </main>

      <PrimaryButton
        text="주문 확인"
        isDisabled={!cart || !cart.cartItems.some((item) => item.checkStatus)}
        onClick={async () => {
          await createOrderCheck();
          navigate('/order-check');
        }}
      />
    </>
  );
};

export default ShoppingCart;
