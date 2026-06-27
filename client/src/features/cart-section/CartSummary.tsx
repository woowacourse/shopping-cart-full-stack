import type { CartItem } from "../../entites/cart/model";
import {
  calculateOrderPrice,
  calculateShippingFee,
  calculateTotalOrderPrice,
} from "../../entites/cart/model";
import { SummaryContainer, SummaryItem } from "../../shared/Summary";
import { ToolTip } from "../../shared/ToolTip";

interface CartSummaryProps {
  checkedItems: CartItem[];
}

export const CartSummary = ({ checkedItems }: CartSummaryProps) => {
  const orderPrice = calculateOrderPrice(checkedItems);
  const shippingFee = calculateShippingFee(orderPrice);
  const totalOrderPrice = calculateTotalOrderPrice(orderPrice, shippingFee);

  return (
    <SummaryContainer>
      <ToolTip text={"총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다."} />
      <SummaryItem title="주문금액" content={`${orderPrice.toLocaleString()}원`} />
      <SummaryItem title="배송비" content={`${shippingFee.toLocaleString()}원`} />
      <SummaryItem title="총결제금액" content={`${totalOrderPrice.toLocaleString()}원`} />
    </SummaryContainer>
  );
};
