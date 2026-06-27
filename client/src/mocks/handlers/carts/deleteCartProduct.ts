import { http, HttpResponse } from "msw";
import { cart } from "@/mocks/datas/carts";

export const deleteCartProduct = http.delete(
  "/api/carts/:cartId/products/:productId",
  ({ params }) => {
    const { productId } = params;
    
    const productExists = cart.products.some((p) => p.id === Number(productId));

    if (!productExists) {
      return HttpResponse.json(
        {
          status: 404,
          errorCode: "RESOURCE_NOT_FOUND",
          errorMessage: "id에 해당하는 장바구니 상품이 존재하지 않습니다.",
        },
        { status: 404 },
      );
    }

    // Mutate state for tests
    cart.products = cart.products.filter((p) => p.id !== Number(productId));

    return new HttpResponse(null, { status: 204 });
  },
);
