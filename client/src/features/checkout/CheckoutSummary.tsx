import type { Summary } from "../../entites/checkout/model";
import { SummaryContainer, SummaryItem } from "../../shared/Summary";
import { ToolTip } from "../../shared/ToolTip";

export const CheckoutSummary = ({
  orderPrice,
  discountPrice,
  deliveryPrice,
  totalPrice,
}: Summary) => {
  const minusFormat = (num: number) => (num > 0 ? -1 * num : num);
  return (
    <SummaryContainer>
      <ToolTip text={"총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다."} />
      <SummaryItem title="주문 금액" content={`${orderPrice.toLocaleString()}원`} />
      <SummaryItem
        title="쿠폰 할인 금액"
        content={`${minusFormat(discountPrice).toLocaleString()}원`}
      />
      <SummaryItem title="배송비" content={`${deliveryPrice.toLocaleString()}원`} />
      <hr />
      <SummaryItem title="총 결제금액" content={`${totalPrice.toLocaleString()}원`} />
    </SummaryContainer>
  );
};
