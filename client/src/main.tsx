import { createRoot } from "react-dom/client";
import "./reset.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import CartPage from "./pages/CartPage/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.tsx";
import OrderCompletePage from "./pages/OrderCompletePage/OrderCompletePage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="complete" element={<OrderCompletePage />} />
    </Route>,
  ),
);

const root = document.getElementById("root");

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  return worker.start({
    serviceWorker: {
      url: `mockServiceWorker.js`,
    },
  });
}

async function prepareApp() {
  if (import.meta.env.VITE_USE_MSW !== "true") return;

  await enableMocking();
}

prepareApp().then(() => {
  createRoot(root!).render(<RouterProvider router={router} />);
});
