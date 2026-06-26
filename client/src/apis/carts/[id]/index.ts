import type { Cart } from "@/types/cartProduct";
import fetcher from "@apis/instance";

const CARTS_API = "/carts";

//TODO: 타입을 기본형이 아닌 프론트 사용 타입으로 변경하기
interface PatchCartQuantityResponse {
  status: "success" | "error";
  message: string;
  data: Cart;
}

export interface PatchCartQuantityRequest {
  id: string;
  quantity: number;
}

export const patchCartQuantity = async ({
  id,
  quantity,
}: PatchCartQuantityRequest) => {
  const { data } = await fetcher.patch<PatchCartQuantityResponse>(
    `${CARTS_API}/${id}`,
    { quantity },
  );
  return data;
};

interface DeleteCartItemResponse {
  status: "success" | "error";
  message: string;
  data: {
    id: string;
  };
}

export interface DeleteCartItemRequest {
  id: string;
}

export const deleteCartItem = async ({ id }: DeleteCartItemRequest) => {
  const { data } = await fetcher.delete<DeleteCartItemResponse>(
    `${CARTS_API}/${id}`,
  );
  return data;
};
