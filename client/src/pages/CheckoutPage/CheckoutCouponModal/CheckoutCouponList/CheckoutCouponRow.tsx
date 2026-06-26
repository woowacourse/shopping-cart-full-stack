import type {
  CheckoutApplyCouponResponse,
  CheckoutCoupon,
} from "../../../../domain/checkout/checkout.api";
import { MAX_APPLY_COUPON_COUNT } from "../../../../domain/checkout/checkout.constant";
import {
  formatCouponUsageConditions,
  formatExpiryDate,
} from "../../../../domain/checkout/checkout.util";
import BaseCheckBox from "../../../../shared/components/BaseCheckBox";
import ListItem from "../../../../shared/components/Layout/ListItem";
import { typography } from "../../../../shared/styles/typography";
import type { AsyncState } from "../../../../shared/useAsyncTask";

const CheckoutCouponRow = ({
  coupon,
  selectedCouponIds,
  onSelectCoupon,
  updateApplyCouponAsyncState,
}: {
  coupon: CheckoutCoupon;
  selectedCouponIds: number[];
  onSelectCoupon: (couponId: number, nextSelect: boolean) => void;
  updateApplyCouponAsyncState: AsyncState<CheckoutApplyCouponResponse>;
}) => {
  const { id, name, expiryDate, minAmount, startTime, endTime, isAvailable } =
    coupon;
  const isSelected = selectedCouponIds.includes(id);
  const isDisabled =
    updateApplyCouponAsyncState.status === "loading" ||
    !isAvailable ||
    (selectedCouponIds.length >= MAX_APPLY_COUPON_COUNT &&
      !selectedCouponIds.includes(id));
  return (
    <ListItem
      title={
        <label>
          <BaseCheckBox
            isSelected={isSelected}
            disabled={isDisabled}
            onSelect={(nextSelect) => onSelectCoupon(id, nextSelect)}
          />
          <span css={typography.titleMedium}>{name}</span>
        </label>
      }
      subTitle={
        <div>
          <div css={typography.bodySmall}>
            만료일: {formatExpiryDate(expiryDate)}
          </div>
          {formatCouponUsageConditions({
            minAmount,
            startTime,
            endTime,
          }).map((conditionString) => (
            <div css={typography.bodySmall}>{conditionString}</div>
          ))}
        </div>
      }
    />
  );
};

export default CheckoutCouponRow;
