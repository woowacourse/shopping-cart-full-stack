import { useState } from "react";
import { updateCartItemQuantity } from "../apis/cart/cart";
import { useMyMutation } from "../lib/myQuery/useMyMutation";
import { CART_QUERY_KEY } from "../constants/queryKeys";

type Status = "idle" | "pending" | "error";

export function useUpdateCartItemQuantity() {
  const [status, setStatus] = useState<Status>("idle");
  const { mutate } = useMyMutation(CART_QUERY_KEY, ({ id, quantity }: { id: number; quantity: number }) =>
    updateCartItemQuantity(id, quantity),
  );

  const updateQuantity = async (id: number, quantity: number) => {
    setStatus("pending");
    try {
      await mutate({ id, quantity });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const increaseCartItemQuantity = (id: number, quantity: number) => updateQuantity(id, quantity + 1);
  const decreaseCartItemQuantity = (id: number, quantity: number) => updateQuantity(id, quantity - 1);

  return {
    isPending: status === "pending",
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
  };
}
