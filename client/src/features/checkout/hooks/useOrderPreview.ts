import { useCallback, useState } from "react";
import type { OrderPreview } from "../types";
import { postOrderPreview } from "../api/order";

export function useOrderPreview(selectedItemIds: string[]) {
  const [preview, setPreview] = useState<OrderPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(
    async (
      coupons: string[],
      isRemoteArea: boolean,
      mode: "auto" | "manual",
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await postOrderPreview(
          { selectedItemIds, coupons, isRemoteArea },
          mode,
        );
        setPreview(result);
        return result;
      } catch (e) {
        setError(e);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedItemIds],
  );

  return { preview, isLoading, error, refresh };
}
