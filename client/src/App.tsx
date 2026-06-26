import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Global } from '@emotion/react';
import { CartPage } from './ui/pages/CartPage/CartPage';
import { resetStyles } from './styles/resetStyles';
import { PreorderPage } from './ui/pages/PreorderPage/PreorderPage';
import { OrderConfirmPage } from './ui/pages/OrderConfirmPage/OrderConfirmPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Global styles={resetStyles} />
      <Routes>
        <Route path="/" element={<Navigate to="/cart" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/preorder" element={<PreorderPage />} />
        <Route path="/orders/:orderId" element={<OrderConfirmPage />} />
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
