import type { OrderProduct, PriceInfo } from "@/types/order";
import { ROUTES } from "@constants/routes";
import { useLocation, useNavigate } from "react-router";

interface LocationState {
  products: OrderProduct[];
  totalAmount: PriceInfo["totalPrice"];
}

function usePaymentNavigate() {
  const nav = useNavigate();
  const loc = useLocation();

  const navigate = (state: LocationState) =>
    nav(ROUTES.PAYMENT, {
      state,
    });

  const getState = (): LocationState | null => {
    return loc.state;
  };

  return {
    navigate,
    getState,
  };
}

export default usePaymentNavigate;
