import styled from "@emotion/styled";
import ShoppingCart from "./pages/shoppingCart/ShoppingCart";
import { HashRouter, Routes, Route } from "react-router-dom";
import CheckOrder from "./pages/checkOrder/CheckOrder";
import PaymentConfirm from "./pages/payment/PaymentConfirm";

export default function App() {
  return (
    <AppContainer>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ShoppingCart />} />
          <Route path="/checkorder" element={<CheckOrder />} />
          <Route path="/payment" element={<PaymentConfirm />} />
        </Routes>
      </HashRouter>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  width: 430px;
  max-width: 100%;
  height: 100svh;
  overflow-y: auto;
  background-color: white;
`;
