import type { ServerOrderProductDetail, ServerCoupon as APIServerCoupon } from "@/apis/orders/dto";

export type ServerOrderProduct = ServerOrderProductDetail;

export interface ServerOrder {
  orderId: number;
  products: ServerOrderProduct[];
  coupons: number[];
  isRemoteArea: boolean;
  deliveryFee: number;
}

export type ServerCoupon = APIServerCoupon;
