import { ProductNotFoundError } from '../errors';
import {
  CartItemsRepository,
  ProductsRepository,
  ProductsServicePort,
  Product,
} from '../types';
import { ProductSchema } from './../schemas';

class ProductsService implements ProductsServicePort {
  private readonly productsRepository;
  private readonly cartItemsRepository;

  constructor({
    productsRepository,
    cartItemsRepository,
  }: {
    productsRepository: ProductsRepository;
    cartItemsRepository: CartItemsRepository;
  }) {
    this.productsRepository = productsRepository;
    this.cartItemsRepository = cartItemsRepository;
  }

  async getProducts() {
    return await this.productsRepository.getAll();
  }

  async insertProduct(product: Omit<Product, 'productId'>) {
    const parsedProduct = ProductSchema.parse(product);

    return await this.productsRepository.insert(parsedProduct);
  }

  async deleteProduct(productId: Product['productId']) {
    const product = await this.productsRepository.getById(productId);

    if (!product) throw new ProductNotFoundError(productId);

    const cartItems = await this.cartItemsRepository.getAll();

    for (const item of cartItems) {
      if (item.productId === productId) {
        await this.cartItemsRepository.deleteById(item.cartItemId);
      }
    }

    const deleted = await this.productsRepository.deleteById(productId);

    if (!deleted) throw new ProductNotFoundError(productId);

    return { productId: deleted.productId };
  }
}

export default ProductsService;
