import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "@constants/routes.ts";

interface LocationState {
  orderId: number;
}

export default function useOrderFormNavigate() {
  const nav = useNavigate();
  const loc = useLocation();

  const navigate = (state: LocationState) => {
    nav(ROUTES.ORDER_FORM, { state });
  };

  const getState = (): LocationState | null => {
    return loc.state;
  };

  return {
    navigate,
    getState,
  };
}
