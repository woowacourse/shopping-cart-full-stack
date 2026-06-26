import InfoIcon from "../../assets/info.svg?react";
import { formatPrice } from "../../utils/format";
import { useShippingPolicy } from "../../hooks/useShippingPolicy";
import Summary from "../Summary";

interface CartOrderSummaryProps {
  orderAmount: number;
  shippingFee: number;
  totalAmount: number;
}

export default function CartOrderSummary({ orderAmount, shippingFee, totalAmount }: CartOrderSummaryProps) {
  const { freeShippingThreshold } = useShippingPolicy();

  return (
    <Summary>
      <Summary.Message>
        <InfoIcon /> 총 주문 금액이 {formatPrice(freeShippingThreshold)} 이상일 경우 무료 배송됩니다.
      </Summary.Message>
      <Summary.Breakdown>
        <Summary.Item label="주문 금액" value={formatPrice(orderAmount)} />
        <Summary.Item label="배송비" value={formatPrice(shippingFee)} />
      </Summary.Breakdown>
      <Summary.Result data-testid="total-amount">
        <Summary.Item label="총 결제 금액" value={formatPrice(totalAmount)} />
      </Summary.Result>
    </Summary>
  );
}
