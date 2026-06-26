export interface CouponsResponse {
  coupons: {
    id: number;
    name: string;
    code: string;
    expirationDate: string;
    minimumOrderAmount?: number;
    validityPeriod?: {
      startsAt: string;
      endsAt: string;
    };
  }[];
}
