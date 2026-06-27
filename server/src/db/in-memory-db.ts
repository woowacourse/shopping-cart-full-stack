import type { ProductEntity } from "../features/product/product.entity.js";
import type { CartEntity } from "../features/cart/cart.entity.js";
import { CouponEntity } from "../features/coupon/coupon.entity.js";

export interface InMemoryDB {
  PRODUCT_TABLE: ProductEntity[];
  CART_TABLE: CartEntity[];
  COUPON_TABLE: CouponEntity[];
}

export const DB: InMemoryDB = {
  PRODUCT_TABLE: [],
  CART_TABLE: [],
  COUPON_TABLE: [],
};
