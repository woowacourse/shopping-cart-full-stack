import { useLocation } from "react-router";

export const useCheckedProductIds = (): number[] => {
  const location = useLocation();
  const state = location.state;
  return state?.checkedProductIds ?? [];
};
