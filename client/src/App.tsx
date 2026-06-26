import { createBrowserRouter, RouterProvider } from "react-router";
import MobileLayout from "./components/MobileLayout";
import { BASE_PATH, ROUTES } from "./constants/routes";
import { MyQueryProvider } from "./lib/myQuery/MyQueryProvider";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: MobileLayout,
      children: [
        { path: ROUTES.CART.slice(1), Component: CartPage },
        { path: ROUTES.CHECKOUT.slice(1), Component: CheckoutPage },
        { path: ROUTES.ORDER_SUCCESS.slice(1), Component: OrderSuccessPage },
      ],
    },
  ],
  { basename: BASE_PATH },
);

export default function App() {
  return (
    <MyQueryProvider>
      <RouterProvider router={router} />
    </MyQueryProvider>
  );
}
