export type CouponCode =
  | 'FIXED5000'
  | 'BOGO'
  | 'FREESHIPPING'
  | 'MIRACLESALE';

export type Coupon = {
  id: CouponCode;
  isSelected: boolean;
  isDisabled: boolean;
  name: string;
  dueDate: string;
  minOrderAmount?: number;
  availableTime?: {
    startTime: string;
    endTime: string;
  };
};

export type CouponDiscount = {
  discountAmount: number;
};
