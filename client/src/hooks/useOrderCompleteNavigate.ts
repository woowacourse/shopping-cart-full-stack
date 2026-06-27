import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "@constants/routes.ts";

interface LocationState {
  productCount: number;
  totalQuantity: number;
  totalAmount: number;
}

export default function useOrderCompleteNavigate() {
  const nav = useNavigate();
  const loc = useLocation();

  const navigate = (state: LocationState) => {
    nav(ROUTES.ORDER_COMPLETE, { state, replace: true });
  };

  const getState = (): LocationState | null => {
    return loc.state;
  };

  return {
    navigate,
    getState,
  };
}
