import info from "@assets/info.svg";
import Spacing from "@components/common/shared/layout/Spacing";
import Divider from "@components/common/shared/ui/Divider";
import styled from "@emotion/styled";

interface OrderAmountProps {
  orderAmount: number;
  deliveryFee: number;
  totalAmount: number;
  discountAmount?: number;
}

function OrderAmount({
  orderAmount,
  deliveryFee,
  totalAmount,
  discountAmount,
}: OrderAmountProps) {
  return (
    <OrderAmountContainer>
      <OrderAmountInfoWrapper>
        <InfoIcon src={info} alt="정보" />
        <InfoText>
          총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
        </InfoText>
      </OrderAmountInfoWrapper>
      <Spacing size={0.75} />
      <Divider />
      <Spacing size={0.75} />
      <OrderAmountInfoContainer>
        <OrderAmountInfoLabel>총 주문 금액</OrderAmountInfoLabel>
        <OrderAmountInfoValue>
          {orderAmount.toLocaleString()}원
        </OrderAmountInfoValue>
      </OrderAmountInfoContainer>
      <Spacing size={0.5} />
      {discountAmount && (
        <OrderAmountInfoContainer>
          <OrderAmountInfoLabel>쿠폰 할인 금액</OrderAmountInfoLabel>
          <OrderAmountInfoValue>
            - {discountAmount.toLocaleString()}원
          </OrderAmountInfoValue>
        </OrderAmountInfoContainer>
      )}
      <Spacing size={0.5} />
      <OrderAmountInfoContainer>
        <OrderAmountInfoLabel>배송비</OrderAmountInfoLabel>
        <OrderAmountInfoValue>
          {deliveryFee.toLocaleString()}원
        </OrderAmountInfoValue>
      </OrderAmountInfoContainer>
      <Spacing size={0.75} />
      <Divider />
      <Spacing size={0.75} />
      <OrderAmountInfoContainer>
        <OrderAmountInfoLabel>총 결제 금액</OrderAmountInfoLabel>
        <OrderAmountInfoValue>
          {totalAmount.toLocaleString()}원
        </OrderAmountInfoValue>
      </OrderAmountInfoContainer>
    </OrderAmountContainer>
  );
}

const OrderAmountContainer = styled.div``;

const OrderAmountInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const InfoIcon = styled.img`
  width: 0.875rem;
  aspect-ratio: 1/1;
`;

const InfoText = styled.span`
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 0.9375rem;
`;

const OrderAmountInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
`;

const OrderAmountInfoLabel = styled.span`
  font-weight: 700;
  font-size: 1rem;
  line-height: 1rem;
`;

const OrderAmountInfoValue = styled.span`
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 100%;
`;

export default OrderAmount;
