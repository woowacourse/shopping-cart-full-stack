import { ROUTES } from "@constants/routes";
import { useNavigate } from "react-router";

export default function useOrderConfirmNavigate() {
  const nav = useNavigate();

  const navigate = () => nav(ROUTES.ORDER_CONFIRM);

  return {
    navigate,
  };
}
