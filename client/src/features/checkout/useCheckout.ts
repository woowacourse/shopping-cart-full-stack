import { useEffect, useState } from "react";
import { checkoutApi } from "../../entites/checkout/api";
import type { Checkout } from "../../entites/checkout/model";

type CheckoutState =
  | { status: "loading" }
  | { status: "success"; data: Checkout }
  | { status: "error"; error: string };

export const useCheckout = (
  checkedProductIds: number[],
  hardDeliveryPlace: boolean,
  selectedCouponIds: string[],
) => {
  const [state, setState] = useState<CheckoutState>({
    status: "loading",
  });

  useEffect(() => {
    if (checkedProductIds.length === 0) return;

    async function init() {
      try {
        const data = await checkoutApi({
          checkedProductIds,
          hardDeliveryPlace,
          selectedCouponIds,
        });
        setState({
          status: "success",
          data,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        setState({
          status: "error",
          error: error.message,
        });
      }
    }
    init();
  }, [checkedProductIds, hardDeliveryPlace, selectedCouponIds]);

  return { state };
};
