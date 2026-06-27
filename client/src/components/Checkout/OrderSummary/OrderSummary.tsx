import infoIcon from "../../../assets/info-icon.png";
import SummaryRow from "../../../commons/SummaryRow/SummaryRow";
import { Container, Divider, SummaryInfo } from "./OrderSummary.styles";

interface Props {
  orderAmount: number;
  couponDiscountAmount: number;
  shippingFee: number;
  totalPaymentAmount: number;
}

const OrderSummary = ({
  orderAmount,
  couponDiscountAmount,
  shippingFee,
  totalPaymentAmount,
}: Props) => {
  return (
    <Container>
      <SummaryInfo>
        <img src={infoIcon} alt="" />
        <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
      </SummaryInfo>
      <Divider />
      <SummaryRow label="주문 금액" value={orderAmount} />
      <SummaryRow label="쿠폰 할인 금액" value={couponDiscountAmount} />
      <SummaryRow label="배송비" value={shippingFee} />
      <Divider />
      <SummaryRow label="총 결제 금액" value={totalPaymentAmount} />
    </Container>
  );
};

export default OrderSummary;
