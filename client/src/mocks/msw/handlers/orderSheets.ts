import { http, HttpResponse } from "msw";

import { ENV } from "@/configs/env";

import {
  orderSheets as initialOrderSheets,
  pricing,
} from "@/mocks/data/orderSheets";

const createOrderSheets = () => {
  return initialOrderSheets;
};

let orderSheets = createOrderSheets();

export const resetCartsProducts = () => {
  orderSheets = createOrderSheets();
};

export const handlers = [
  http.get(ENV.API_URL + "/order-sheet/:id", async ({ params }) => {
    const id = Number(params.id) - 1;
    const orderSheet = orderSheets[id];

    return HttpResponse.json(
      {
        data: { orderSheet },
        status: 200,
      },
      { status: 200 },
    );
  }),

  http.post(ENV.API_URL + "/order-sheet/:cartId", async () => {
    return HttpResponse.json(
      {
        data: { orderSheetId: 1 },
        status: 200,
      },
      { status: 200 },
    );
  }),
  http.get(ENV.API_URL + "/order-sheet/:id/pricing", async () => {
    return HttpResponse.json(
      {
        data: { pricing },
        status: 200,
      },
      { status: 200 },
    );
  }),
  http.patch(ENV.API_URL + "/order-sheet/:id/shipping-area", async () => {
    return HttpResponse.json(undefined, { status: 204 });
  }),
  http.get(ENV.API_URL + "/order-sheet/:id/able-coupons", async () => {
    return HttpResponse.json(
      {
        data: { able: ["FIXED5000", "MIRACLESALE"] },
        status: 200,
      },
      { status: 200 },
    );
  }),
  http.post(
    ENV.API_URL + "/order-sheet/:id/coupon-discount-preview",
    async () => {
      return HttpResponse.json(
        {
          data: { couponDiscountAmount: 0 },
          status: 200,
        },
        { status: 200 },
      );
    },
  ),
  http.patch(ENV.API_URL + "/order-sheet/:id/coupons", async () => {
    return HttpResponse.json(undefined, { status: 204 });
  }),
];
