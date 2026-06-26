import { http, HttpResponse } from "msw";
import { createId, db } from "./db";
import type { OrderProduct } from "./db";
import { ERROR_CODES, MockAppError, withErrorHandling } from "./errors";
import {
  assertCouponsExist,
  calculateOrderPrice,
  calculatePriceInfo,
  calculateShippingFee,
  buildDiscountContextItems,
  calculateDiscountPrice,
  getBestCoupons,
  getProductByIdOrThrow,
  toPriceInfoResponse,
} from "./services";

// server: app.use("/order", ordersRouter) → 단수 경로
const API = "/api/order";
const MAX_COUPON_COUNT = 2;

// server 는 단일 주문만 다룬다(orders.repository.getOrders()[0]).
const getCurrentOrder = () => [...db.orders.values()][0];

// server orders.schema.checkOrderProduct
const checkOrderProduct = (
  orderProduct: unknown,
): orderProduct is OrderProduct => {
  if (typeof orderProduct !== "object" || orderProduct === null) return false;
  if (
    !("productId" in orderProduct) ||
    typeof orderProduct.productId !== "string"
  )
    return false;
  if (
    !("quantity" in orderProduct) ||
    typeof orderProduct.quantity !== "number"
  )
    return false;
  return true;
};

// server orders.schema.validateCreateOrder
const validateCreateOrder = (body: unknown): OrderProduct[] => {
  if (!body || typeof body !== "object" || !("orderProducts" in body)) {
    throw new MockAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  const { orderProducts } = body as { orderProducts: unknown };

  if (!Array.isArray(orderProducts) || orderProducts.length === 0) {
    throw new MockAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  if (!orderProducts.every(checkOrderProduct)) {
    throw new MockAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  for (const { quantity } of orderProducts) {
    if (quantity < 1 || quantity > 99) {
      throw new MockAppError(ERROR_CODES.OUT_OF_RANGE_ORDER_QUANTITY);
    }
  }

  return orderProducts;
};

// server orders.schema.validateUpdateOrder
const validateUpdateOrder = (
  body: unknown,
): { couponIds: string[] } | { isIsland: boolean } => {
  if (!body || typeof body !== "object") {
    throw new MockAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  if ("couponIds" in body) {
    const { couponIds } = body as { couponIds: unknown };
    if (
      !Array.isArray(couponIds) ||
      !couponIds.every((id) => typeof id === "string")
    ) {
      throw new MockAppError(ERROR_CODES.INVALID_COUPON_IDS);
    }
    return { couponIds };
  }

  if ("isIsland" in body) {
    const { isIsland } = body as { isIsland: unknown };
    if (typeof isIsland !== "boolean") {
      throw new MockAppError(ERROR_CODES.INVALID_IS_ISLAND);
    }
    return { isIsland };
  }

  throw new MockAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
};

// server orders.schema.validateCouponIds
const validateCouponIds = (body: unknown): string[] => {
  if (!body || typeof body !== "object" || !("couponIds" in body)) {
    throw new MockAppError(ERROR_CODES.INVALID_COUPON_IDS);
  }

  const { couponIds } = body as { couponIds: unknown };

  if (
    !Array.isArray(couponIds) ||
    !couponIds.every((id) => typeof id === "string")
  ) {
    throw new MockAppError(ERROR_CODES.INVALID_COUPON_IDS);
  }

  return couponIds;
};

export const ordersHandlers = [
  // POST /order/discount-price (더 구체적인 경로를 먼저 등록)
  http.post(
    `${API}/discount-price`,
    withErrorHandling(async ({ request }) => {
      const couponIds = validateCouponIds(
        await request.json().catch(() => ({})),
      );

      assertCouponsExist(couponIds);

      const order = getCurrentOrder();
      // 명세: 저장된 주문이 없으면 404 (존재하지 않는 주문입니다.)
      if (!order) throw new MockAppError(ERROR_CODES.NOT_EXIST_ORDER);

      const orderPrice = calculateOrderPrice(order.orderProducts);
      const products = buildDiscountContextItems(order.orderProducts);
      const deliveryFee = calculateShippingFee(orderPrice, order.isIsland);

      const discountPrice = couponIds.reduce(
        (acc, couponId) =>
          acc +
          calculateDiscountPrice(couponId, {
            orderPrice,
            deliveryFee,
            products,
          }),
        0,
      );

      return HttpResponse.json({
        status: "success",
        message: "할인 금액을 정상적으로 계산하였습니다.",
        data: { discountPrice },
      });
    }),
  ),

  // GET /order
  http.get(
    API,
    withErrorHandling(() => {
      const order = getCurrentOrder();

      if (!order) {
        throw new MockAppError(ERROR_CODES.NOT_EXIST_ORDER);
      }

      const orderProducts = order.orderProducts.map(
        ({ productId, quantity }) => {
          const product = getProductByIdOrThrow(productId);
          return {
            productId,
            productName: product.name,
            productPrice: product.price,
            imgUrl: product.image,
            quantity,
          };
        },
      );

      const priceInfo = calculatePriceInfo(
        order.orderProducts,
        order.couponIds,
        order.isIsland,
      );

      return HttpResponse.json({
        status: "success",
        message: "주문 정보를 정상적으로 조회하였습니다.",
        data: {
          orderId: order.orderId,
          orderProducts,
          isIsland: order.isIsland,
          couponIds: order.couponIds,
          priceInfo: toPriceInfoResponse(priceInfo),
        },
      });
    }),
  ),

  // POST /order
  http.post(
    API,
    withErrorHandling(async ({ request }) => {
      const orderProducts = validateCreateOrder(
        await request.json().catch(() => ({})),
      );

      const isIsland = false;
      const orderPrice = calculateOrderPrice(orderProducts);
      const products = buildDiscountContextItems(orderProducts);
      const deliveryFee = calculateShippingFee(orderPrice, isIsland);

      // server: 주문 생성 시 최적 쿠폰을 자동 선택해 적용한다.
      const couponIds = getBestCoupons(
        { deliveryFee, orderPrice, products },
        MAX_COUPON_COUNT,
      ).map(({ couponId }) => couponId);

      const orderId = createId();
      db.orders.set(orderId, { orderId, orderProducts, couponIds, isIsland });

      return HttpResponse.json(
        {
          status: "success",
          message: "주문 정보를 정상적으로 추가하였습니다.",
          data: { orderId },
        },
        { status: 201 },
      );
    }),
  ),

  // PATCH /order
  http.patch(
    API,
    withErrorHandling(async ({ request }) => {
      const validated = validateUpdateOrder(
        await request.json().catch(() => ({})),
      );

      const order = getCurrentOrder();
      // 명세: 저장된 주문이 없으면 404 (존재하지 않는 주문입니다.)
      if (!order) throw new MockAppError(ERROR_CODES.NOT_EXIST_ORDER);

      if ("couponIds" in validated) {
        if (validated.couponIds.length > MAX_COUPON_COUNT) {
          throw new MockAppError(ERROR_CODES.EXCEED_MAX_COUPON_COUNT);
        }
        assertCouponsExist(validated.couponIds);

        db.orders.set(order.orderId, {
          ...order,
          couponIds: validated.couponIds,
        });

        const priceInfo = calculatePriceInfo(
          order.orderProducts,
          validated.couponIds,
          order.isIsland,
        );

        return HttpResponse.json({
          status: "success",
          message: "주문 정보를 정상적으로 수정하였습니다.",
          data: { priceInfo: toPriceInfoResponse(priceInfo) },
        });
      }

      db.orders.set(order.orderId, { ...order, isIsland: validated.isIsland });

      const priceInfo = calculatePriceInfo(
        order.orderProducts,
        order.couponIds,
        validated.isIsland,
      );

      return HttpResponse.json({
        status: "success",
        message: "주문 정보를 정상적으로 수정하였습니다.",
        data: { priceInfo: toPriceInfoResponse(priceInfo) },
      });
    }),
  ),
];
