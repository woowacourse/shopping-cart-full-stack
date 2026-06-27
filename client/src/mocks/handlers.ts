import { http, HttpResponse } from "msw";
import { cartItems } from "./mockDatabase";

export const handlers = [
  http.get(/\/cart$/, () => {
    return HttpResponse.json(cartItems);
  }),

  http.post(/\/orders\/summary$/, async ({ request }) => {
    const { selectedCartItemIds } = (await request.json()) as {
      selectedCartItemIds: number[];
    };
    const orderItems = cartItems.filter((item) =>
      selectedCartItemIds.includes(item.id),
    );
    const orderAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingFee = orderAmount >= 100000 ? 0 : 3000;

    return HttpResponse.json({
      orderItems,
      orderAmount,
      couponDiscountAmount: 0,
      shippingFee,
      totalPaymentAmount: orderAmount + shippingFee,
    });
  }),

  http.patch(/\/cart\/\d+$/, async ({ request }) => {
    const id = Number(new URL(request.url).pathname.split("/").at(-1));
    const cartItem = cartItems.find((item) => item.id === id);
    const { quantity } = (await request.json()) as { quantity?: number };

    if (!cartItem) {
      return HttpResponse.json(
        {
          code: "CART_ITEM_NOT_FOUND",
          message: "장바구니 상품을 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    if (quantity && quantity > cartItem.stock) {
      return HttpResponse.json(
        {
          code: "OUT_OF_STOCK",
          message: "요청한 수량이 현재 재고보다 많습니다.",
        },
        { status: 409 },
      );
    }

    if (quantity) cartItem.quantity = quantity;

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/cart\/\d+$/, ({ request }) => {
    const id = Number(new URL(request.url).pathname.split("/").at(-1));
    const index = cartItems.findIndex((item) => item.id === id);

    if (index !== -1) {
      cartItems.splice(index, 1);
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
