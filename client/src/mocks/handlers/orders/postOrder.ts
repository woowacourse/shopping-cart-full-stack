import { http, HttpResponse } from "msw";
import { orders } from "@/mocks/datas/orders";
import { products } from "@/mocks/datas/products";
import type { ServerOrderProduct } from "@/mocks/datas/orders.type";
import type { ServerPostOrderResponse } from "@/apis/orders/dto";

export const postOrder = http.post("/api/orders", async ({ request }) => {
  const body = (await request.json()) as { products: { id: number; quantity: number }[] };

  if (!body || !body.products) {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "필수값이 누락되었습니다.",
        data: [{ type: "products", errorCode: "MISSING_FIELD_PRODUCTS" }],
      },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.products)) {
    return HttpResponse.json(
      { status: 400, errorCode: "TYPE_MISMATCH", errorMessage: "타입이 일치하지 않습니다." },
      { status: 400 },
    );
  }

  const orderProducts: ServerOrderProduct[] = [];

  for (const reqProduct of body.products) {
    const productData = products.find((p) => p.id === reqProduct.id);

    // If product not found, we treat it as OUT_OF_STOCK in this mock context (or we could use RESOURCE_NOT_FOUND)
    if (!productData) {
      return HttpResponse.json(
        { status: 409, errorCode: "OUT_OF_STOCK", errorMessage: "품절된 상품이 포함되어 있습니다." },
        { status: 409 },
      );
    }

    orderProducts.push({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      imgUrl: productData.imgUrl,
      quantity: reqProduct.quantity,
      hasGift: false,
    });
  }

  const orderId = orders.length + 1;

  orders.push({
    orderId,
    products: orderProducts,
    coupons: [],
    isRemoteArea: false,
    deliveryFee: 3000,
  });

  return HttpResponse.json<ServerPostOrderResponse>({ status: 201, data: { orderId } }, { status: 201 });
});
