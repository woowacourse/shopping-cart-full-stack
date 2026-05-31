import { type CartRepository } from "./cart.repository.js";
import { CartNotFoundError } from "./cart.error.js";
import Cart from "./cart.js";

export default class CartService {
  constructor(private cartRepository: CartRepository) {}

  async getAll() {
    return this.cartRepository.findAll();
  }

  async updateQuantity(productId: number, quantity: number) {
    const cart = await this.cartRepository.findByProductId(productId);
    if (!cart) {
      throw new CartNotFoundError();
    }

    const cartDomain = new Cart({ productId, quantity });
    await this.cartRepository.save(cartDomain.toEntity());

    return {
      productId,
      quantity,
    };
  }

  async delete(productId: number) {
    await this.cartRepository.remove(productId);
  }
}
