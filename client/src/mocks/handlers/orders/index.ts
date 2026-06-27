import { postOrder } from "./postOrder";
import { getOrder } from "./getOrder";
import { patchOrder } from "./patchOrder";
import { getDiscount } from "./getDiscount";
import { getCoupons } from "./getCoupons";

export const orderHandlers = [
  postOrder,
  getOrder,
  patchOrder,
  getDiscount,
  getCoupons,
];
