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
    if (!product) throw new NotFoundError({ productId: '삭제할 상품을 찾을 수 없습니다.' });

    const cartItems = await this.cartItemsRepository.getAll();

    cartItems.forEach(async (item) => {
      if (item.productId === productId) {
        await this.cartItemsRepository.deleteById(item.cartItemId);
      }
    });

    return await this.productsRepository.deleteById(productId);
  }
}

export default ProductsService;
