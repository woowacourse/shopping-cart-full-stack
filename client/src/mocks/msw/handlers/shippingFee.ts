import { http, HttpResponse } from "msw";

import { ENV } from "@/configs/env";

import { shippingFee as initialShippingFee } from "@/mocks/data/shippingFee";

const createShippingFee = () => {
  return initialShippingFee;
};

let shippingFee = createShippingFee();

export const resetCartsProducts = () => {
  shippingFee = createShippingFee();
};

export const handlers = [
  http.get(ENV.API_URL + "/shipping-fee", async () => {
    return HttpResponse.json(
      {
        data: { shippingFee },
        status: 200,
      },
      { status: 200 },
    );
  }),
];
