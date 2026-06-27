import { useNavigate } from "react-router";
import { ROUTES } from "@constants/routes.ts";

export default function useCartsNavigate() {
  const nav = useNavigate();

  const navigate = () => {
    nav(ROUTES.CARTS);
  };

  return {
    navigate,
  };
}
