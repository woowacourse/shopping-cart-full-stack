import { NotFoundError, BadRequestError } from '../errors';
import ProductsRepository from '../repositories/ProductsRepository';
import CartItemsRepository from '../repositories/CartItemsRepository';
import { Product } from '../types';

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
    if (product.name.length < 1 || product.name.length > 100)
      throw new BadRequestError({ name: '상품명은 1자 이상 100자 이하여야 합니다.' });

    if (product.price <= 0 || !Number.isInteger(product.price))
      throw new BadRequestError({ price: '가격은 0보다 큰 정수여야 합니다.' });

    if (product.stock < 0 || product.stock > 99 || !Number.isInteger(product.stock))
      throw new BadRequestError({ stock: '재고는 0 이상 99 이하의 정수여야 합니다.' });

    return await this.productsRepository.insert(product);
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
