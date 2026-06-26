import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CalculatedPrice } from "@cart/shared";
import { fetchOrderApi } from "../../../infrastructure/api/fetchOrderApi";

interface ApiError {
  status: number;
  message: string;
}

const isApiError = (err: unknown): err is ApiError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  );
};

export const usePreorderMutation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitPayment = async (
    preorderId: string,
    selectedCouponIds: number[],
    isRemoteArea: boolean,
    priceSummary: CalculatedPrice,
  ) => {
    setIsSubmitting(true);
    try {
      const order = await fetchOrderApi.submitOrder(
        preorderId,
        selectedCouponIds,
        isRemoteArea,
        priceSummary,
      );
      alert("결제가 성공적으로 완료되었습니다!");
      navigate(`/orders/${order.orderId}`, { replace: true });
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 409 || err.status === 404) {
          alert(`${err.message}\n장바구니로 돌아가 최신 상태를 갱신합니다.`);
          navigate("/cart", { replace: true });
          return;
        }
      }
      alert("결제 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPayment, isSubmitting };
};
