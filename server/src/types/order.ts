export interface PreviewOrderRequestBody {
  preorderId: string;
  isRemoteArea: boolean;
  couponIds: number[];
}

export interface ExcludedCoupon {
  couponId: number;
  code: string;
  name: string;
  excludedReason: string;
}
