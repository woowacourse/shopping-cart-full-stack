import { ProductNotFoundError } from "./product.error.js";
import Product, { ProductProps } from "./product.js";
import { ProductRepository } from "./product.repository.js";

export default class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAll() {
    const products = await this.productRepository.findAll();
    return products.sort((a, b) => a.id - b.id);
  }

  async getById(productId: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  }

  async register(productProps: ProductProps) {
    const product = new Product(productProps);
    return this.productRepository.save(product.getProduct());
  }

  async delete(productId: number): Promise<void> {
    await this.productRepository.remove(productId);
  }
}
