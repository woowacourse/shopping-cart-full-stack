import { http, HttpResponse } from "msw";
import { products } from "@/mocks/datas";

export const getProducts = http.get("/api/products", () => {
  return HttpResponse.json(
    {
      status: 200,
      data: products,
    },
    { status: 200 },
  );
});
