import { AppError } from "@/errors/AppError";
import type { CartItem } from "@/type";
import { calcOrderBreakdown, findBogoGiftProductId, isCouponUsable, selectTopTwoCoupons } from "./orders.domain";
import type { OrderProduct, PatchOrderCouponBody, PatchOrderShippingBody } from "./orders.schema";
import {
  createOrderCouponsQuery,
  createOrderProductsQuery,
  createOrderQuery,
  getAllCouponsQuery,
  getOrderByIdQuery,
  getOrderCouponsByOrderIdQuery,
  getOrderProductsByOrderIdQuery,
  getProductWithStockQuery,
  getProductsByIdsQuery,
  reserveProductsQuery,
  updateOrderCouponsQuery,
  updateOrderIsRemoteAreaQuery,
  updateOrderProductGiftsQuery,
} from "./orders.repository";

const BASE_DELIVERY_FEE = 3_000;

export const createOrder = async (orderProducts: OrderProduct[]) => {
  // 상품 존재 확인, 재고 확인
  for (const item of orderProducts) {
    const product = await getProductWithStockQuery(item.id);
    if (!product) throw new AppError("NOT_EXIST_PRODUCT");
    if (product.stock <= 0) throw new AppError("OUT_OF_STOCK");
  }

  // 상품 예약하고 재고 차감
  await reserveProductsQuery(orderProducts);

  // 쿠폰 조회, 상품 정보 조회
  const [coupons, products] = await Promise.all([
    getAllCouponsQuery(),
    getProductsByIdsQuery(orderProducts.map((i) => i.id)),
  ]);

  const domainCartItems: CartItem[] = orderProducts.map((item) => ({
    product: products.find((p) => p.id === item.id)!,
    quantity: item.quantity,
  }));

  const orderTotal = domainCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // 쿠폰 선택
  const now = new Date();
  const usableCoupons = coupons.filter((c) =>
    isCouponUsable(c, domainCartItems, orderTotal, now),
  );
  const selectedCoupons = selectTopTwoCoupons(
    usableCoupons,
    domainCartItems,
    orderTotal,
    BASE_DELIVERY_FEE,
    now,
  );

  // 주문 레코드 생성
  const order = await createOrderQuery();

  // 주문 상품 저장
  const orderProductsWithPrice = orderProducts.map((item) => ({
    ...item,
    price: products.find((p) => p.id === item.id)!.price,
  }));
  await createOrderProductsQuery(order.id, orderProductsWithPrice);

  // 주문 쿠폰 저장
  if (selectedCoupons.length > 0) {
    await createOrderCouponsQuery(
      order.id,
      selectedCoupons.map((c) => c.id),
    );
  }

  return { orderId: order.id };
};

const REMOTE_AREA_FEE = 3_000;

export const patchOrderCoupon = async (orderId: number, body: PatchOrderCouponBody) => {
  const order = await getOrderByIdQuery(orderId);
  if (!order) throw new AppError("NOT_FOUND_ORDER");

  const [coupons, orderProducts] = await Promise.all([
    getAllCouponsQuery(),
    getOrderProductsByOrderIdQuery(orderId),
  ]);

  const selectedCoupons = coupons.filter((c) => body.couponIds.includes(c.id));
  const now = new Date();
  for (const coupon of selectedCoupons) {
    const expirationDay = new Date(coupon.expirationDate);
    expirationDay.setHours(23, 59, 59, 999);
    if (expirationDay < now) throw new AppError("EXPIRED_COUPON");
  }

  await updateOrderCouponsQuery(orderId, body.couponIds);

  const domainCartItems: CartItem[] = orderProducts.map((p) => ({
    product: { id: p.id, name: p.name, price: p.price, image: p.image },
    quantity: p.quantity,
  }));
  const hasBogo = selectedCoupons.some((c) => c.discountType === "buyXgetY");
  const giftProductId = hasBogo ? findBogoGiftProductId(domainCartItems) : null;
  await updateOrderProductGiftsQuery(orderId, giftProductId);

  const { orderAmount, couponDiscount, shippingDiscount, totalAmount } = calcOrderBreakdown(
    selectedCoupons,
    domainCartItems,
    order.deliveryFee,
    now,
  );
  const appliedCoupons = selectedCoupons.map((c) => ({
    id: c.id,
    title: c.title,
    discountType: c.discountType,
    discountValue: c.discountValue,
  }));

  return { coupons: appliedCoupons, orderAmount, couponDiscount, shippingDiscount, totalAmount };
};

export const patchOrderShipping = async (orderId: number, body: PatchOrderShippingBody) => {
  const order = await getOrderByIdQuery(orderId);
  if (!order) throw new AppError("NOT_FOUND_ORDER");

  const deliveryFee = BASE_DELIVERY_FEE + (body.isRemoteArea ? REMOTE_AREA_FEE : 0);
  await updateOrderIsRemoteAreaQuery(orderId, body.isRemoteArea, deliveryFee);

  const [appliedCoupons, orderProducts] = await Promise.all([
    getOrderCouponsByOrderIdQuery(orderId),
    getOrderProductsByOrderIdQuery(orderId),
  ]);
  const domainCartItems: CartItem[] = orderProducts.map((p) => ({
    product: { id: p.id, name: p.name, price: p.price, image: p.image },
    quantity: p.quantity,
  }));
  const { orderAmount, couponDiscount, shippingDiscount, totalAmount } = calcOrderBreakdown(
    appliedCoupons,
    domainCartItems,
    deliveryFee,
  );

  return { isRemoteArea: body.isRemoteArea, deliveryFee, orderAmount, couponDiscount, shippingDiscount, totalAmount };
};

export const getCoupons = async (orderId: number) => {
  const order = await getOrderByIdQuery(orderId);
  if (!order) throw new AppError("NOT_FOUND_ORDER");

  const [coupons, orderProducts] = await Promise.all([
    getAllCouponsQuery(),
    getOrderProductsByOrderIdQuery(orderId),
  ]);

  const domainCartItems: CartItem[] = orderProducts.map((p) => ({
    product: { id: p.id, name: p.name, price: p.price, image: p.image },
    quantity: p.quantity,
  }));
  const orderTotal = domainCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const now = new Date();

  return coupons.map((coupon) => ({
    ...coupon,
    isCouponUsable: isCouponUsable(coupon, domainCartItems, orderTotal, now),
  }));
};

export const getOrder = async (orderId: number) => {
  const order = await getOrderByIdQuery(orderId);
  if (!order) throw new AppError("NOT_FOUND_ORDER");

  const [products, appliedCoupons] = await Promise.all([
    getOrderProductsByOrderIdQuery(orderId),
    getOrderCouponsByOrderIdQuery(orderId),
  ]);

  const domainCartItems: CartItem[] = products.map((p) => ({
    product: { id: p.id, name: p.name, price: p.price, image: p.image },
    quantity: p.quantity,
  }));
  const { orderAmount, couponDiscount, shippingDiscount, totalAmount } = calcOrderBreakdown(
    appliedCoupons,
    domainCartItems,
    order.deliveryFee,
  );
  const coupons = appliedCoupons.map((c) => ({
    id: c.id,
    title: c.title,
    discountType: c.discountType,
    discountValue: c.discountValue,
  }));

  return {
    products,
    coupons,
    isRemoteArea: order.isRemoteArea,
    deliveryFee: order.deliveryFee,
    orderAmount,
    couponDiscount,
    shippingDiscount,
    totalAmount,
  };
};
