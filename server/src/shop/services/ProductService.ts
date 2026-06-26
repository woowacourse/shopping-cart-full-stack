import { NotFoundError } from "../../errors.js";
import Product from "../models/Product.js";
import {
  CartRepository,
  ProductRepository,
} from "../repositories/InMemoryRepositories.js";

export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  getAll() {
    return this.productRepository.findAll().map((p: Product) => p.toObject());
  }

  add(body: { name: string; price: number; thumbnail: string }) {
    const product = new Product(body);
    this.productRepository.save(product.getId(), product);
    return { id: product.getId() };
  }

  delete(id: string) {
    if (!this.productRepository.exists(id)) {
      throw new NotFoundError();
    }
    this.productRepository.delete(id);
    const cart = this.cartRepository.get();
    cart.deleteItemByProductId(id);
  }
}
