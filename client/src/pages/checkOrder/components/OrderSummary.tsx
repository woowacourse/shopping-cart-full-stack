import styled from "@emotion/styled";
import infoOutline from "../../../assets/infoOutline.svg";

interface Props {
  orderAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalPayment: number;
}

/** 서버가 계산한 금액을 그대로 보여주는 결제 금액 요약. */
export default function OrderSummary({
  orderAmount,
  discountAmount,
  shippingFee,
  totalPayment,
}: Props) {
  return (
    <Summary>
      <Notice>
        <img src={infoOutline} alt="" />
        <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
      </Notice>
      <Divider />
      <PriceRow>
        <h4>주문 금액</h4>
        <span>{orderAmount.toLocaleString()}원</span>
      </PriceRow>
      <PriceRow>
        <h4>쿠폰 할인 금액</h4>
        <span>-{discountAmount.toLocaleString()}원</span>
      </PriceRow>
      <PriceRow>
        <h4>배송비</h4>
        <span>{shippingFee.toLocaleString()}원</span>
      </PriceRow>
      <Divider />
      <PriceRow>
        <h4>총 결제 금액</h4>
        <span>{totalPayment.toLocaleString()}원</span>
      </PriceRow>
    </Summary>
  );
}

const Summary = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Notice = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  p {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: rgba(10, 13, 19, 1);
  }
`;

const Divider = styled.div`
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    color: rgba(10, 13, 19, 1);
  }

  span {
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    color: rgba(0, 0, 0, 1);
  }
`;
