import * as cartsRepository from "./carts.repository.ts";
import { ServiceError } from "../../common/error.ts";
import { getMissingFields } from "../../validate/getMissingFields.ts";

export const getCartById = (cartId: number) => {
  const cart = cartsRepository.findById(cartId);
  if (!cart)
    throw new ServiceError(
      "RESOURCE_NOT_FOUND",
      "id에 해당하는 장바구니가 존재하지 않습니다.",
      404,
    );

  return {
    id: cart.id,
    products: cart.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imgUrl: product.imgUrl,
      quantity: product.quantity,
    })),
  };
};

interface CartUpdateOption {
  quantity: number;
}

export const updateCartProduct = (
  cartId: number,
  productId: number,
  cartUpdateOption: Partial<CartUpdateOption>,
) => {
  const requiredFields = ["quantity"] as const;
  const missingFields = getMissingFields(
    cartUpdateOption,
    requiredFields as unknown as string[],
  );

  if (missingFields.length > 0) {
    throw new ServiceError(
      "MISSING_FIELD",
      "필수값이 누락되었습니다.",
      missingFields.map((field) => ({
        type: field,
        errorCode: `MISSING_FIELD_${field.toUpperCase()}`,
      })),
    );
  }

  const product = cartsRepository.updateProductQuantity(
    cartId,
    productId,
    cartUpdateOption.quantity!,
  );

  if (!product) {
    throw new ServiceError(
      "RESOURCE_NOT_FOUND",
      "id에 해당하는 장바구니 상품이 존재하지 않습니다.",
    );
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imgUrl: product.imgUrl,
    quantity: product.quantity,
  };
};

export const deleteCartProduct = (cartId: number, productId: number) => {
  const product = cartsRepository.findProductInCart(cartId, productId);

  if (!product) {
    throw new ServiceError(
      "RESOURCE_NOT_FOUND",
      "id에 해당하는 장바구니 상품이 존재하지 않습니다.",
    );
  }

  cartsRepository.deleteProductInCart(cartId, productId);
};
