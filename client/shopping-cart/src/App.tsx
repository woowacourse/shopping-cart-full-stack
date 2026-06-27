import { Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import PaymentCheck from './pages/PaymentCheck';
import ShoppingCart from './pages/ShoppingCart';
import OrderCheck from './pages/OrderCheck';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<ShoppingCart />} />
        <Route path="/order-check" element={<OrderCheck />} />
        <Route path="/payment-check" element={<PaymentCheck />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
