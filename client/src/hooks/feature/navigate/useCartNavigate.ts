import { ROUTES } from "@constants/routes";
import { useNavigate } from "react-router";

export default function useCartNavigate() {
  const nav = useNavigate();

  const navigate = () => nav(ROUTES.CARTS);

  return {
    navigate,
  };
}
