import { useState } from "react";
import { getIsRemoteArea, setIsRemoteArea } from "../storage/order.storage";

export function useRemoteAreaSelection() {
  const [isRemoteArea, setRemoteArea] = useState(() => getIsRemoteArea());

  const toggleRemoteArea = () => {
    setRemoteArea((prev) => {
      const nextValue = !prev;
      setIsRemoteArea(nextValue);
      return nextValue;
    });
  };

  return {
    isRemoteArea,
    toggleRemoteArea,
  };
}
