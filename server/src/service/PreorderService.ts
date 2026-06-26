import { PreorderItem } from "@cart/shared";
import { Preorder } from "../repositories/Preorder";
import { CartRepositoryInterface } from "../repositories/interfaces/CartRepositoryInterface";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { PreorderRepositoryInterface } from "../repositories/interfaces/PreorderRepositoryInterface";
import { NotFoundError, InvalidError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";

export default class PreorderService {
  #cartRepo: CartRepositoryInterface;
  #productRepo: ProductRepositoryInterface;
  #preorderRepo: PreorderRepositoryInterface;

  constructor(
    cartRepo: CartRepositoryInterface,
    productRepo: ProductRepositoryInterface,
    preorderRepo: PreorderRepositoryInterface,
  ) {
    this.#cartRepo = cartRepo;
    this.#productRepo = productRepo;
    this.#preorderRepo = preorderRepo;
  }

  createPreorder(selectedCartIds: number[]): Preorder {
    if (!selectedCartIds || selectedCartIds.length === 0) {
      throw new InvalidError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);
    }

    const preorderItems: PreorderItem[] = selectedCartIds.map((cartItemId) => {
      const cartItem = this.#cartRepo.findById(cartItemId);
      if (!cartItem) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);

      const product = this.#productRepo.findById(cartItem.productId);
      if (!product) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_PRODUCT);

      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        quantity: cartItem.quantity,
      };
    });

    return this.#preorderRepo.save(preorderItems);
  }

  getPreorder(preorderId: string): Preorder {
    const preorder = this.#preorderRepo.findById(preorderId);
    if (!preorder) {
      throw new NotFoundError(ERROR_MESSAGE.NO_PREORDER_RECEIPT);
    }
    return preorder;
  }
}
