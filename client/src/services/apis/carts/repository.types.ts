/**
 * TODO:
 * repository 반환 모델 정의 후 unknown 제거
 */

export interface GetCartsParams {
  cartId: number;
}

export type GetCarts = (params: GetCartsParams) => Promise<{
  id: number;
  products: {
    id: number;
    name: string;
    price: number;
    imgUrl: string;
    quantity: number;
  }[];
}>;

export interface PatchCartsProductsCommand {
  cartId: number;
  productId: number;
  quantity: number;
}

export type PatchCartsProducts = (
  command: PatchCartsProductsCommand,
) => Promise<unknown>;

export interface DeleteCartsProductsParams {
  cartId: number;
  productId: number;
}

export type DeleteCartsProducts = (
  params: DeleteCartsProductsParams,
) => Promise<void>;
