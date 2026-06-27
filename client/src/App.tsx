import { BrowserRouter, Route, Routes } from "react-router";
import { CartPage } from "./pages/CartPage";
import { ResultPage } from "./pages/ResultPage";
import { CheckoutPage } from "./pages/CheckoutPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
