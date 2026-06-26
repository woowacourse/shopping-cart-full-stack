import { Product } from "@modules/products/types";

export interface CouponDB {
  couponId: string;
  couponName: string;
  isDisabled: boolean;
  couponExpiration: number;
  option: string;
}

export interface OrdersDB {
  orderId: string;
  orderProducts: OrderProduct[];
  isIsland: boolean;
  couponIds: CouponDB["couponId"][];
}

export interface OrderProduct {
  productId: Product["id"];
  quantity: number;
}

export type OrderInfo = Omit<OrdersDB, "orderId">;
