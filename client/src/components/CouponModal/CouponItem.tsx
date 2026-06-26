import { css } from "@emotion/react";
import Checkbox from "../Checkbox";
import type { Coupon } from "../../domain/coupon";
import { formatDate, formatPrice, formatTimeRange } from "../../utils/format";

interface CouponItemProps {
  coupon: Coupon;
  isChecked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}

export default function CouponItem({ coupon, isChecked, disabled, onChange }: CouponItemProps) {
  const couponMetaList = getCouponMetaList(coupon);

  const handleClick = () => {
    if (disabled) return;
    onChange(!isChecked);
  };

  return (
    <div
      css={[containerStyle, disabled ? disabledStyle : interactiveStyle]}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      <div css={checkboxStyle}>
        <Checkbox checked={isChecked} disabled={disabled} readOnly>
          <span className="typo-md-b">{coupon.name}</span>
        </Checkbox>
      </div>
      <div css={metaStyle}>
        {couponMetaList.map((meta) => (
          <span key={meta} className="typo-sm-r">
            {meta}
          </span>
        ))}
      </div>
    </div>
  );
}

const getCouponMetaList = (coupon: Coupon) => {
  const couponMetaList: string[] = [];

  if (coupon.expiredDate) {
    couponMetaList.push(`만료일: ${formatDate(coupon.expiredDate)}`);
  }

  if (coupon.minOrderAmount !== undefined) {
    couponMetaList.push(`최소 주문 금액: ${formatPrice(coupon.minOrderAmount)}`);
  }

  if (coupon.usableStartAt && coupon.usableEndAt) {
    couponMetaList.push(`사용 가능 시간: ${formatTimeRange(coupon.usableStartAt, coupon.usableEndAt)}`);
  }

  return couponMetaList;
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #e5e5e5;
`;

const metaStyle = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const checkboxStyle = css`
  pointer-events: none;
`;

const interactiveStyle = css`
  cursor: pointer;
`;

const disabledStyle = css`
  color: #666;
  cursor: not-allowed;
`;
