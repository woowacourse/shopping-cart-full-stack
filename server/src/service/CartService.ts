import type { CartItemData } from "../repositories/CartItem";
import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { CartRepositoryInterface } from "../repositories/interfaces/CartRepositoryInterface";
import { ProductData } from "../repositories/Product";
import { validateQuantity } from "../util/Validator";

export interface CartResponseData {
  cartItemId: number;
  quantity: number;
  product: ProductData | null;
}

export default class CartService {
  #productRepository: ProductRepositoryInterface;
  #cartRepository: CartRepositoryInterface;

  constructor(
    productRepository: ProductRepositoryInterface,
    cartRepository: CartRepositoryInterface,
  ) {
    this.#productRepository = productRepository;
    this.#cartRepository = cartRepository;
  }

  getCartItems(): CartResponseData[] {
    const cartItems = this.#cartRepository.getCartProducts();

    return cartItems.map((cartItem) => {
      const product = this.#productRepository.findById(cartItem.productId);
      return {
        cartItemId: cartItem.cartItemId,
        quantity: cartItem.quantity,
        product: product,
      };
    });
  }

  #mergeIfExisting(productId: number, quantity: number): CartItemData | null {
    const cartItems = this.#cartRepository.getCartProducts();
    const existingItem = cartItems.find((item) => item.productId === productId);

    if (!existingItem) return null;

    const mergedQuantity = existingItem.quantity + quantity;
    validateQuantity(mergedQuantity);

    const updatedItem = this.#cartRepository.changeQuantity(existingItem.cartItemId, mergedQuantity);
    if (!updatedItem) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

    return updatedItem;
  }

  postCartItem(productId: number, quantity: number): CartItemData {
    validateQuantity(quantity);
    const product = this.#productRepository.findById(Number(productId));
    if (!product) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_PRODUCT);

    const mergedItem = this.#mergeIfExisting(productId, quantity);
    if (mergedItem) return mergedItem;

    return this.#cartRepository.addProductToCart(productId, quantity);
  }

  deleteCartItem(cartItemId: number): void {
    if (!cartItemId) throw new InvalidError(ERROR_MESSAGE.INVALID_CART_ID);

    const cartItem = this.#cartRepository.findById(cartItemId);
    if (!cartItem) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

    this.#cartRepository.deleteByCartId(cartItemId);
  }

  patchCartItem(cartItemId: number, newQuantity: number): CartItemData {
    validateQuantity(newQuantity);
    if (!cartItemId) throw new InvalidError(ERROR_MESSAGE.INVALID_CART_ID);
    if (!newQuantity) throw new InvalidError(ERROR_MESSAGE.INVALID_QUANTITY);

    const updatedQuantity = this.#cartRepository.changeQuantity(
      cartItemId,
      newQuantity,
    );
    if (!updatedQuantity)
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

    return updatedQuantity;
  }
}
