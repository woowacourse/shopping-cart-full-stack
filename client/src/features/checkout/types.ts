import { z } from "../../shared/schema";

export interface CheckoutState {
  selectedItemIds: string[];
}

/** 주문 확인 → 결제 확인 으로 넘기는 최종 표시값 (서버가 계산한 스냅샷) */
export interface PaymentConfirmState {
  kindsCount: number;
  totalQuantity: number;
  totalPrice: number;
}

export const couponSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  expirationDate: z.string(),
  description: z.string(),
});
export type Coupon = z.infer<typeof couponSchema>;

export const orderPreviewSchema = z.object({
  orderAmount: z.number(),
  couponDiscount: z.number(),
  deliveryFee: z.number(),
  totalPrice: z.number(),
  appliedCoupons: z.array(z.string()),
  couponStatuses: z.array(
    z.object({
      id: z.string(),
      applicable: z.boolean(),
      reason: z.string().nullable(),
    }),
  ),
});
export type OrderPreview = z.infer<typeof orderPreviewSchema>;
