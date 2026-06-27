import { Navigate, Route, Routes } from 'react-router-dom';
import { CartPage } from './feature/Cart/CartPage';
import { OrderConfirmPage } from './feature/OrderConfirm/OrderConfirmPage';
import { OrderDraftPage } from './feature/OrderDraft/OrderDraftPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cart" replace />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-draft" element={<OrderDraftPage />} />
      <Route path="/order-confirm" element={<OrderConfirmPage />} />
    </Routes>
  );
}

export default App;
