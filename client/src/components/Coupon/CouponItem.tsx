import styled from '@emotion/styled';
import CheckBox from '../CheckBox/CheckBox';
import type { Coupon } from '../../types/coupon.types';
import { formatPrice } from '../../utils/formatPrice';
import { formatAvailableTime, formatDueDate } from '../../utils/formatCoupon';

interface CouponItemProps {
  coupon: Coupon;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

export default function CouponItem({
  coupon,
  isSelected,
  onToggle,
}: CouponItemProps) {
  const { id, name, isDisabled, dueDate, minOrderAmount, availableTime } =
    coupon;
  const time = formatAvailableTime(availableTime);

  return (
    <Container $isDisabled={isDisabled}>
      <CheckBox
        isSelected={isSelected}
        disabled={isDisabled}
        onSelect={() => onToggle(id)}
      />
      <Content>
        <Name>{name}</Name>
        <Description>만료일: {formatDueDate(dueDate)}</Description>
        {minOrderAmount > 0 && (
          <Description>
            최소 주문 금액: {formatPrice(minOrderAmount)}원
          </Description>
        )}
        {time && <Description>사용 가능 시간: {time}</Description>}
      </Content>
    </Container>
  );
}

const Container = styled.div<{ $isDisabled: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 0;
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.4 : 1)};

  & + & {
    border-top: 1px solid #0000001a;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Name = styled.strong`
  font-size: 18px;
  font-weight: 700;
  color: #0a0d13;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #0000008a;
`;
