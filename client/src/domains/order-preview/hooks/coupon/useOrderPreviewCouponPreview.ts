import type {CouponId} from '../../../coupon/domain/types.js';
import {useOrderPreview} from '../useOrderPreview.js';

interface UseOrderPreviewCouponPreviewParams {
  preorderId: string | undefined;
  isRemoteArea: boolean;
  couponIds: CouponId[];
  enabled: boolean;
}

export function useOrderPreviewCouponPreview({
  preorderId,
  isRemoteArea,
  couponIds,
  enabled,
}: UseOrderPreviewCouponPreviewParams) {
  return useOrderPreview({
    preorderId,
    isRemoteArea,
    couponIds,
    enabled,
  });
}
