import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CartPage from './pages/CartPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import PaymentCompletePage from './pages/PaymentCompletePage';
import { ModalProvider } from './components/modal/ModalProvider';

function App() {
    return (
        <BrowserRouter>
            <ModalProvider>
                <Routes>
                    <Route path="/" element={<CartPage />} />
                    <Route path="/order-confirm" element={<OrderConfirmPage />} />
                    <Route path="/payment-complete" element={<PaymentCompletePage />} />
                </Routes>
            </ModalProvider>
        </BrowserRouter>
    );
}

export default App;
