import { css } from "@emotion/react";
import type {
  CheckoutApplyCouponResponse,
  CheckoutCoupon,
} from "../../../../domain/checkout/checkout.api";
import List from "../../../../shared/components/Layout/List";
import ListItem from "../../../../shared/components/Layout/ListItem";
import type { AsyncState } from "../../../../shared/useAsyncTask";
import CheckoutCouponRow from "./CheckoutCouponRow";
import { typography } from "../../../../shared/styles/typography";
import WarningIcon from "../../../../assets/warning.png";
import { MAX_APPLY_COUPON_COUNT } from "../../../../domain/checkout/checkout.constant";

const CheckoutCouponList = ({
  coupons,
  selectedCouponIds,
  onSelectCoupon,
  updateApplyCouponAsyncState,
}: {
  coupons: CheckoutCoupon[];
  selectedCouponIds: number[];
  onSelectCoupon: (couponId: number, nextSelect: boolean) => void;
  updateApplyCouponAsyncState: AsyncState<CheckoutApplyCouponResponse>;
}) => {
  return (
    <List gap="8px">
      <ListItem
        prefix={
          <img src={WarningIcon} css={css({ width: "16px", height: "16px" })} />
        }
        title={
          <span css={typography.bodyMedium}>
            쿠폰은 최대 {MAX_APPLY_COUPON_COUNT}개까지 사용할 수 있습니다.
          </span>
        }
      />

      {coupons.map((coupon) => (
        <CheckoutCouponRow
          key={coupon.id}
          coupon={coupon}
          selectedCouponIds={selectedCouponIds}
          onSelectCoupon={onSelectCoupon}
          updateApplyCouponAsyncState={updateApplyCouponAsyncState}
        />
      ))}
    </List>
  );
};

export default CheckoutCouponList;
