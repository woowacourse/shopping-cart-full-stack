import { AppError } from "@/errors/AppError";
import type { CartItem } from "@/type";
import { calculateFinalAmount } from "../orders/orders.domain";
import {
  getOrderByIdQuery,
  getOrderCouponsByOrderIdQuery,
  getOrderProductsByOrderIdQuery,
  removeExpiredCouponsFromOrderQuery,
} from "../orders/orders.repository";
import type { CreatePaymentBody } from "./payments.schema";

export const createPayment = async (body: CreatePaymentBody) => {
  const order = await getOrderByIdQuery(body.orderId);
  if (!order) throw new AppError("NOT_FOUND_ORDER");

  const [orderProducts, orderCoupons] = await Promise.all([
    getOrderProductsByOrderIdQuery(body.orderId),
    getOrderCouponsByOrderIdQuery(body.orderId),
  ]);

  const now = new Date();
  const expiredCouponIds = orderCoupons
    .filter((coupon) => {
      const expirationDay = new Date(coupon.expirationDate);
      expirationDay.setHours(23, 59, 59, 999);
      return expirationDay < now;
    })
    .map((c) => c.id);

  if (expiredCouponIds.length > 0) {
    await removeExpiredCouponsFromOrderQuery(body.orderId, expiredCouponIds);
    throw new AppError("EXPIRED_COUPON");
  }

  const domainCartItems: CartItem[] = orderProducts.map((p) => ({
    product: { id: p.id, name: p.name, price: p.price, image: p.image },
    quantity: p.quantity,
  }));
  const orderTotal = domainCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const finalAmount = calculateFinalAmount(
    orderCoupons,
    domainCartItems,
    orderTotal,
    order.deliveryFee,
    now,
  );

  console.log({ orderTotal, deliveryFee: order.deliveryFee, coupons: orderCoupons.map(c => c.discountType), finalAmount, sentAmount: body.amount });
  if (finalAmount !== body.amount) throw new AppError("PAYMENT_AMOUNT_MISMATCH");

  return { finalAmount };
};
