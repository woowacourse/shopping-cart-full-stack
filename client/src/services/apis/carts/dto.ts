import type { ResponseDTO } from "@/services/apis/api.types";

export interface GetCartsRequestDto {
  pathParams: { name: "cartId"; value: number }[];
}

export type GetCartsResponseDto = ResponseDTO<
  200,
  {
    id: number;
    products: {
      id: number;
      name: string;
      price: number;
      imgUrl: string;
      quantity: number;
    }[];
  }
>;

export interface PatchCartsProductsRequestDto {
  pathParams: { name: "cartId" | "productId"; value: number }[];
  data: { quantity: number };
}

export type PatchCartsProductsResponseDto = ResponseDTO<
  200,
  {
    id: number; // product id,
    name: string;
    price: number;
    imgUrl: string;
    quantity: number;
  }
>;

export interface DeleteCartsProductsRequestDto {
  pathParams: { name: "cartId" | "productId"; value: number }[];
}

// 장바구니 상품 삭제
// No Content
// export interface DeleteCartsProductsResponseDto {}
