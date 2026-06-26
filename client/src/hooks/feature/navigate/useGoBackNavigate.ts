import { useNavigate } from "react-router";

export default function useGoBackNavigate() {
  const nav = useNavigate();

  const navigate = () => {
    nav(-1);
  };

  return {
    navigate,
  };
}
