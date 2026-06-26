import { http, HttpResponse } from "msw";

import { ENV } from "@/configs/env";

import { coupons as initialCoupons } from "@/mocks/data/coupons";

const createCoupons = () => {
  return initialCoupons;
};

let coupons = createCoupons();

export const resetCartsProducts = () => {
  coupons = createCoupons();
};

export const handlers = [
  http.get(ENV.API_URL + "/coupons", async () => {
    return HttpResponse.json(
      {
        data: { coupons },
        status: 200,
      },
      { status: 200 },
    );
  }),
];
