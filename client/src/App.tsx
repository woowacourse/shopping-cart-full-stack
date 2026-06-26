import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartPage from './cart/CartPage';
import OrderConfirmPage from './order/OrderConfirmPage';
import PaymentAmountPage from './payment/PaymentAmountPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<CartPage />} />
        <Route
          path="/order-confirm/:orderSheetId"
          element={<OrderConfirmPage />}
        />
        <Route
          path="/payment/:orderSheetId"
          element={<PaymentAmountPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
