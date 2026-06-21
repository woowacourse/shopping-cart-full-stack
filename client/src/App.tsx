import styled from '@emotion/styled';
import {Navigate, Route, Routes} from 'react-router-dom';

import {theme} from './design-system/index.js';
import {CartProvider} from './cart/providers/CartProvider.js';
import {OrderPreviewProvider} from './order/providers/OrderPreviewProvider.js';

import {CartPage} from './cart/pages/CartPage.js';
import {OrderConfirmPage} from './order/pages/OrderConfirmPage.js';
import {OrderPreviewPage} from './order/pages/OrderPreviewPage.js';

export const App = () => {
  return (
    <PhoneView>
      <Routes>
        <Route path='/' element={<Navigate replace to='/cart' />} />
        <Route
          path='cart'
          element={
            <CartProvider>
              <CartPage />
            </CartProvider>
          }
        />
        <Route
          path='order-preview/:preorderId'
          element={
            <OrderPreviewProvider>
              <OrderPreviewPage />
            </OrderPreviewProvider>
          }
        />
        <Route path='order-confirm' element={<OrderConfirmPage />} />
      </Routes>
    </PhoneView>
  );
};

const PhoneView = styled.div`
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  border-right: 1px solid ${theme.colors.gray300};
  border-left: 1px solid ${theme.colors.gray300};
  background: ${theme.colors.white};
  box-shadow: 0 0 24px ${theme.colors.blackAlpha10};
`;
