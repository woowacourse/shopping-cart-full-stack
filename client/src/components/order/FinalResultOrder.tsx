import styled from "styled-components";
import { OrderData } from "../../type/types";

interface Props {
  orderData: OrderData;
}

export default function FinalResultOrder({ orderData }: Props) {
  return (
    <div>
      <Row>
        <span>주문 금액</span>
        <span>{orderData.orderAmount.toLocaleString()}원</span>
      </Row>
      <Row>
        <span>쿠폰 할인 금액</span>

        <span>-{orderData.couponDiscountAmount.toLocaleString()}원</span>
      </Row>
      <Row>
        <span>배송비</span>
        <span>{orderData.shippingFee.toLocaleString()}원</span>
      </Row>
      <Row>
        <span>총 결제 금액</span>
        <span>{orderData.totalAmount.toLocaleString()}원</span>
      </Row>
    </div>
  );
}

const Row = styled.div``;
