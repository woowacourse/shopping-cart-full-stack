import styled from "@emotion/styled";
import { colors } from "../../../shared/styles/tokens";
import { FREE_SHIPPING_THRESHOLD } from "../selectors";
import { InfoOutlineIcon } from "../../../assets/icons/InfoOutlineIcon";
import { Row } from "../../../shared/components/layout";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
}

export function OrderSummary({ subtotal, shippingFee }: OrderSummaryProps) {
  const total = subtotal + shippingFee;
  return (
    <>
      <Hint>
        <InfoOutlineIcon width={12} height={12} />총 주문 금액이{" "}
        {FREE_SHIPPING_THRESHOLD.toLocaleString()}원 이상일 경우 무료
        배송됩니다.
      </Hint>
      <Section>
        <Row justify="space-between" align="center">
          <Label>주문 금액</Label>
          <Amount>{subtotal.toLocaleString()}원</Amount>
        </Row>
        <Row justify="space-between" align="center">
          <Label>배송비</Label>
          <Amount>{shippingFee.toLocaleString()}원</Amount>
        </Row>
      </Section>

      <Section>
        <Row justify="space-between" align="center">
          <Label>총 결제 금액</Label>
          <Amount>{total.toLocaleString()}원</Amount>
        </Row>
      </Section>
    </>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${colors.divider};

  & + & {
    margin-top: 16px;
  }
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const Amount = styled.span`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const Hint = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
  font-size: 12px;
  color: ${colors.textPrimary};
`;
