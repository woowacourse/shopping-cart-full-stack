import InfoIcon from "../../assets/info.svg?react";
import { useShippingPolicy } from "../../hooks/useShippingPolicy";
import Summary from "../Summary";
import { formatPrice } from "../../utils/format";

interface CheckoutSummaryProps {
  orderAmount: number;
  couponDiscount: number;
  shippingFee: number;
  totalAmount: number;
}

export default function CheckoutSummary({
  orderAmount,
  couponDiscount,
  shippingFee,
  totalAmount,
}: CheckoutSummaryProps) {
  const { freeShippingThreshold } = useShippingPolicy();

  return (
    <Summary>
      <Summary.Message>
        <InfoIcon /> 총 주문 금액이 {formatPrice(freeShippingThreshold)} 이상일 경우 무료 배송됩니다.
      </Summary.Message>
      <Summary.Breakdown>
        <Summary.Item label="주문 금액" value={formatPrice(orderAmount)} />
        <Summary.Item label="쿠폰 할인 금액" value={`-${formatPrice(couponDiscount)}`} />
        <Summary.Item label="배송비" value={formatPrice(shippingFee)} />
      </Summary.Breakdown>
      <Summary.Result>
        <Summary.Item label="총 결제 금액" value={formatPrice(totalAmount)} />
      </Summary.Result>
    </Summary>
  );
}
