import styled from '@emotion/styled';
import type { Coupon } from '../../apis/coupon';
import CheckBox from '../../components/CheckBox';

interface CouponItemProps {
  checked: boolean;
  coupon: Coupon;
  disabled?: boolean;
  onToggle: () => void;
}

const CouponItem = ({
  checked,
  coupon,
  disabled = false,
  onToggle,
}: CouponItemProps) => {
  const { availableTimeRange, minimumOrderAmount } = coupon.conditions ?? {};

  return (
    <Item $disabled={disabled}>
      <CouponHeader>
        <CheckBox
          ariaLabel={`${coupon.name} 선택`}
          checked={checked}
          disabled={disabled}
          onToggle={onToggle}
        />
        <CouponName>{coupon.name}</CouponName>
      </CouponHeader>

      <CouponDetails>
        <p>만료일: {formatDate(coupon.expiresAt)}</p>

        {minimumOrderAmount !== undefined && (
          <p>최소 주문 금액: {minimumOrderAmount.toLocaleString()}원</p>
        )}

        {availableTimeRange !== undefined && (
          <p>사용 가능 시간: {formatTimeRange(availableTimeRange)}</p>
        )}
      </CouponDetails>
    </Item>
  );
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

const formatTimeRange = ({
  startsAt,
  endsAt,
}: {
  startsAt: string;
  endsAt: string;
}) => {
  const startHour = Number(startsAt.split(':')[0]);
  const endHour = Number(endsAt.split(':')[0]);
  const startPeriod = startHour < 12 ? '오전' : '오후';
  const endPeriod = endHour < 12 ? '오전' : '오후';
  const formattedStartHour = startHour % 12 || 12;
  const formattedEndHour = endHour % 12 || 12;

  if (startPeriod === endPeriod) {
    return `${startPeriod} ${formattedStartHour}시부터 ${formattedEndHour}시까지`;
  }

  return `${startPeriod} ${formattedStartHour}시부터 ${endPeriod} ${formattedEndHour}시까지`;
};

const Item = styled.li<{ $disabled: boolean }>`
  padding-block: 0.75rem 1.25rem;
  border-top: 1px solid #0000001a;
  color: ${({ $disabled }) => ($disabled ? '#bfbfbf' : '#000000')};
  list-style: none;
`;

const CouponHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CouponName = styled.strong`
  font-size: 1rem;
  font-weight: 700;
`;

const CouponDetails = styled.div`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  line-height: 1.5;

  p {
    margin: 0;
  }
`;

export default CouponItem;
