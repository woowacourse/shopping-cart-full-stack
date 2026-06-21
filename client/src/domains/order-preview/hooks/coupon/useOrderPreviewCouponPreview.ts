import type {CouponId} from '../../../coupon/domain/types.js';
import {useOrderPreview} from '../useOrderPreview.js';

export function useOrderPreviewCouponPreview(
  preorderId: string | undefined,
  isRemoteArea: boolean,
  couponIds: CouponId[],
  isEnabled: boolean
) {
  return useOrderPreview(preorderId, isRemoteArea, couponIds, {
    enabled: isEnabled,
  });
}
