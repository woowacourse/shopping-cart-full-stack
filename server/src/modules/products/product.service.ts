import { AppError } from '../../errors/AppError.js';
import { ModelError } from '../../errors/ModelError.js';
import type {
  CartItemRepository,
  ProductRepository,
} from '../../interfaces/repository.interface.js';
import { cartItemRepository } from '../cart/cartItem.repository.js';
import { productRepository } from './product.repository.js';
import { Product } from './product.model.js';
import type { ProductRequest } from './product.request.js';

export const createProductService = ({
  productRepository,
  cartItemRepository,
}: {
  productRepository: ProductRepository;
  cartItemRepository: CartItemRepository;
}) => ({
  addProduct(params: ProductRequest) {
    try {
      const product = new Product({
        productId: crypto.randomUUID(),
        ...params,
      });
      productRepository.save(product);
      return { productId: product.productId };
    } catch (error) {
      if (error instanceof ModelError) {
        throw new AppError(400, error.code, error.message);
      }

      throw error;
    }
  },
  getProducts() {
    return productRepository.findAll();
  },
  deleteProduct(productId: string) {
    const product = productRepository.findById(productId);

    if (!product)
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');

    cartItemRepository.deleteByProductId(productId);
    productRepository.deleteById(productId);
  },
});

export const productService = createProductService({
  productRepository,
  cartItemRepository,
});
