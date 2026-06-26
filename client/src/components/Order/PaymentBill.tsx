import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import infoIcon from '../../assets/info.svg';
import Skeleton from '../Skeleton/Skeleton';

interface PaymentBillProps {
  totalPrice?: string;
  children: ReactNode;
}

export default function PaymentBill({
  totalPrice,
  children,
}: PaymentBillProps) {
  return (
    <Container>
      <ShippingFeeInfo>
        <IconWrapper>
          <img src={infoIcon} alt="info-icon" />
        </IconWrapper>
        총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
      </ShippingFeeInfo>

      <Section>{children}</Section>

      <Section>
        <PaymentRow label="총 결제 금액" value={totalPrice} />
      </Section>
    </Container>
  );
}

interface PaymentRowProps {
  label: ReactNode;
  value: ReactNode;
}

export function PaymentRow({ label, value }: PaymentRowProps) {
  return (
    <Row>
      <span>{label}</span>
      <strong>{value}</strong>
    </Row>
  );
}

export function PaymentBillSkeleton() {
  return (
    <PaymentBill>
      <PaymentRow
        label={<Skeleton width="80px" height="24px" />}
        value={<Skeleton width="120px" height="24px" />}
      />
      <PaymentRow
        label={<Skeleton width="80px" height="24px" />}
        value={<Skeleton width="120px" height="24px" />}
      />
      <PaymentRow
        label={<Skeleton width="80px" height="24px" />}
        value={<Skeleton width="120px" height="24px" />}
      />
    </PaymentBill>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ShippingFeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #0000001a;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 42px;
  font-size: 24px;
  font-weight: 700;
`;
