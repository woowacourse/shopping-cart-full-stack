export type CouponType = 'FIXED' | 'BOGO' | 'FREE_SHIPPING' | 'PERCENTAGE';

export type AvailableTime = {
  startTime: string;
  endTime: string;
};

export type Coupon = {
  id: number;
  code: string;
  name: string;
  type: CouponType;
  dueDate: string;
  minOrderAmount: number;
  availableTime: AvailableTime;
  // 할인 금액(원), PERCENTAGE: 할인율(%), 그 외 타입은 0
  value: number;
};
