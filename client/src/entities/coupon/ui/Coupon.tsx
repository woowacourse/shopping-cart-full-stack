import Row from '../../../shared/layout/Row';
import Checkbox from '../../../shared/ui/CheckBox';
import Txt from '../../../shared/ui/Txt';
import Flex from '../../../shared/layout/Flex';
import type { Coupon as CouponType } from '../types';
import { formatDueDate } from '../format';

type CouponProps = {
  coupon: CouponType;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Coupon({ coupon, checked, onChange }: CouponProps) {
  const color = coupon.isDisabled ? 'inactive' : 'text';

  return (
    <li
      css={{
        padding: '12px 0 20px 0',
        borderTop: '1px solid #eeeeee',
      }}
    >
      <Row
        left={
          <Flex direction="column" gap={12}>
            <Checkbox
              checked={checked}
              disabled={coupon.isDisabled}
              onChange={onChange}
            >
              <Txt variant="button" color={color}>
                {coupon.name}
              </Txt>
            </Checkbox>
            <Txt variant="label" color={color}>
              만료일: {formatDueDate(coupon.dueDate)}
              {coupon.minOrderAmount !== undefined && (
                <>
                  <br />
                  최소 주문 금액: {coupon.minOrderAmount.toLocaleString()}원
                </>
              )}
              {coupon.availableTime && (
                <>
                  <br />
                  사용 가능 시간: {coupon.availableTime.startTime}부터{' '}
                  {coupon.availableTime.endTime}까지
                </>
              )}
            </Txt>
          </Flex>
        }
      />
    </li>
  );
}
