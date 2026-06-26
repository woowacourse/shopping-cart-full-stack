import Cart from "./pages/Cart";
import OrderConfirm from "./pages/OrderConfirm";
import ConfirmPayment from "./pages/ConfirmPayment";
import { HashRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/order" element={<OrderConfirm />} />
        <Route path="/confirm" element={<ConfirmPayment />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
