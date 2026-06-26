import { NotFoundError } from "../../errors.js";
import {
  CartRepository,
  ProductRepository,
} from "../repositories/InMemoryRepositories.js";

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  getAll() {
    const cart = this.cartRepository.get();
    return cart.getAllItems().map(({ product_id, quantity }) => {
      const product = this.productRepository.findById(product_id)?.toObject();
      return { product_id, quantity, product };
    });
  }

  update(id: string, quantity: number) {
    const cart = this.cartRepository.get();
    if (!cart.hasItemByProductId(id)) {
      throw new NotFoundError();
    }
    cart.updateItemByProductId(id, quantity);
    return { product_id: id, quantity };
  }

  delete(id: string) {
    const cart = this.cartRepository.get();
    if (!cart.hasItemByProductId(id)) {
      throw new NotFoundError();
    }
    cart.deleteItemByProductId(id);
  }
}
