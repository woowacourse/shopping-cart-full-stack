import { useState } from "react";
import type { Coupon } from "../../entites/checkout/model";
import { calculateDiscount } from "../../entites/checkout/lib";
import { MAX_COUPON_SELECT, toCouponViews } from "./couponView";
import { CheckBox } from "../../shared/CheckBox";
import { BottomButton } from "../../shared/BottomButton";
import { ToolTip } from "../../shared/ToolTip";
import styles from "./CouponSelect.module.css";

interface CouponSelectProps {
  coupons: Coupon[];
  orderPrice: number;
  onApply: (selectedIds: string[]) => void;
}

export const CouponSelect = ({ coupons, orderPrice, onApply }: CouponSelectProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    coupons.filter((coupon) => coupon.status.apply).map((coupon) => coupon.id),
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((coupon) => coupon !== id);
      if (prev.length >= MAX_COUPON_SELECT) return prev;
      return [...prev, id];
    });
  };

  const selectedCoupons = coupons.filter((coupon) => selectedIds.includes(coupon.id));
  const estimatedDiscount = calculateDiscount(selectedCoupons, orderPrice);
  const couponViews = toCouponViews(coupons, selectedIds);

  return (
    <div>
      <ToolTip text={`쿠폰은 최대 ${MAX_COUPON_SELECT}개까지 사용할 수 있습니다.`} />

      <ul className={styles.list}>
        {couponViews.map(({ coupon, selected, usable, disabled, ruleText }) => (
          <li key={coupon.id} className={`${styles.item} ${!usable ? styles.unusable : ""}`}>
            <div className={styles.itemHeader}>
              <CheckBox checked={selected} onChange={() => toggle(coupon.id)} disabled={disabled} />
              <span className={styles.name}>{coupon.name}</span>
            </div>
            <p className={styles.detail}>만료일: {coupon.expirationDate}</p>
            {ruleText && <p className={styles.detail}>{ruleText}</p>}
            {coupon.status.message && <p className={styles.detail}>{coupon.status.message}</p>}
          </li>
        ))}
      </ul>

      <BottomButton
        onClick={() => onApply(selectedIds)}
        text={`총 ${estimatedDiscount.toLocaleString()}원 할인 쿠폰 사용하기`}
      />
    </div>
  );
};
