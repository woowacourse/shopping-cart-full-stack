import { NotFoundError } from '../errors';
import ProductsRepository from '../repositories/ProductsRepository';
import CartItemsRepository from '../repositories/CartItemsRepository';
import { Product } from '../types';
import { ProductSchema } from './../schemas';

class ProductsService {
  productsRepository;
  cartItemsRepository;

  constructor() {
    this.productsRepository = new ProductsRepository();
    this.cartItemsRepository = new CartItemsRepository();
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
    if (!product) throw new NotFoundError({ productId: '존재하지 않는 상품입니다.' });

    const cartItems = await this.cartItemsRepository.getAll();

    for (const item of cartItems) {
      if (item.productId === productId) {
        await this.cartItemsRepository.deleteById(item.cartItemId);
      }
    }

    const deleted = await this.productsRepository.deleteById(productId);

    if (!deleted) throw new NotFoundError({ productId: '존재하지 않는 상품입니다.' });

    return { productId: deleted.productId };
  }
}

export default ProductsService;
