import fetcher from "@apis/instance";

const ORDER_DISCOUNT_PRICE_API = "/order/discount-price";

interface PostDiscountPriceResponse {
  status: "success" | "error";
  message: string;
  data: {
    discountPrice: number;
  };
}

export interface PostDiscountPriceRequest {
  couponIds: string[];
}

export const postDiscountPrice = async ({
  couponIds,
}: PostDiscountPriceRequest) => {
  const { data } = await fetcher.post<PostDiscountPriceResponse>(
    `${ORDER_DISCOUNT_PRICE_API}`,
    { couponIds },
  );
  return data;
};
