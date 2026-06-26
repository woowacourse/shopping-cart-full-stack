export type GetCoupons = () => Promise<{
  coupons: {
    id: number;
    name: string;
    code: string;
    expirationDate: string;
    minOrderAmount?: number;
    validTime?: {
      start: string;
      end: string;
    };
  }[];
}>;
