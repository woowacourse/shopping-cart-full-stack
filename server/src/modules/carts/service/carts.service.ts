import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";
import { validateCartQuantity } from "./carts.validator";
import { CartRepository } from "../repository/carts.repository";

export class CartsService {
  constructor(private CartRepository: CartRepository) {}

  getCarts() {
    return this.CartRepository.getCarts();
  }

  changeCartQuantity(id: string, quantity: number) {
    validateCartQuantity(quantity);

    const existingCartItem = this.CartRepository.getCartItemByProductId(id);
    if (!existingCartItem)
      throw createAppError(ERROR_CODES.NOT_EXIST_CARTS_ITEM);

    const updatedCartItem = this.CartRepository.updateCartQuantity(
      id,
      quantity,
    );
    if (!updatedCartItem)
      throw createAppError(ERROR_CODES.NOT_EXIST_CARTS_ITEM);

    return {
      product: updatedCartItem.product,
      quantity: updatedCartItem.quantity,
    };
  }

  deleteCartsProduct(id: string) {
    const existingCartsProduct = this.CartRepository.getCartItemByProductId(id);

    if (!existingCartsProduct) {
      throw createAppError(ERROR_CODES.NOT_EXIST_CARTS_PRODUCT);
    }

    return this.CartRepository.deleteCart(id);
  }

  removeCartItemByProductId(productId: string) {
    const existingCartItem =
      this.CartRepository.getCartItemByProductId(productId);
    if (!existingCartItem) return;

    this.CartRepository.deleteCart(productId);
  }
}
