import type { CartItemData } from "../repositories/CartItem";
import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { CartRepositoryInterface } from "../repositories/interfaces/CartRepositoryInterface";

export default class CartService {
  #productRepository: ProductRepositoryInterface;
  #cartRepository: CartRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface, cartRepository: CartRepositoryInterface) {
    this.#productRepository = productRepository;
    this.#cartRepository = cartRepository;
  }

  getCartItems(): CartItemData[] {
    return this.#cartRepository.getCartProducts();
  }

  postCartItem(productId: number, quantity: number): CartItemData {
    const product = this.#productRepository.findById(Number(productId));
    if (!product) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_PRODUCT);

    return this.#cartRepository.addProductToCart(productId, quantity);
  }

  deleteCartItem(cartItemId: number): void {
    if (!cartItemId) throw new InvalidError(ERROR_MESSAGE.INVALID_CART_ID);

    const cartItem = this.#cartRepository.findById(cartItemId);
    if (!cartItem) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

    this.#cartRepository.deleteByCartId(cartItemId);
  }

  patchCartItem(cartItemId: number, newQuantity: number): CartItemData {
    if (!cartItemId) throw new InvalidError(ERROR_MESSAGE.INVALID_CART_ID);
    if (!newQuantity) throw new InvalidError(ERROR_MESSAGE.INVALID_QUANTITY);

    const updatedQuantity = this.#cartRepository.changeQuantity(cartItemId, newQuantity);
    if (!updatedQuantity) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

    return updatedQuantity;
  }
}
