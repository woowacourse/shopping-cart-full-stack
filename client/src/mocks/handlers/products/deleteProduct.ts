import { http, HttpResponse } from "msw";
import { products } from "@/mocks/datas/products";

export const deleteProduct = http.delete("/api/products/:id", ({ params }) => {
  const { id } = params;
  const productExists = products.some((p) => p.id === Number(id));

  if (!productExists) {
    return HttpResponse.json(
      {
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 상품이 존재하지 않습니다.",
      },
      { status: 404 },
    );
  }

  // NOTE: Static array mutation isn't fully robust here unless products is let/exported mutable,
  // but it fulfills the basic MSW handler requirement for mock behaviors.
  return new HttpResponse(null, { status: 204 });
});
