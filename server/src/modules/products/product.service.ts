import { cartItemRepository } from '../cart/cartItem.repository.js';
import { Product } from './product.model.js';
import { productRepository } from './product.repository.js';

export const productService = {
  addProduct(params: {
    productName: string;
    productPrice: number;
    remainingQuantity: number;
    imageUrl?: string;
  }) {
    const product = new Product({ productId: crypto.randomUUID(), ...params });
    productRepository.save(product);
    return { productId: product.productId };
  },

  getProducts() {
    return productRepository.findAll();
  },
  deleteProduct(productId: string) {
    const product = productRepository.findById(productId);

    if (!product) throw new Error('존재하지 않는 상품입니다.');

    cartItemRepository.deleteByProductId(productId);
    productRepository.deleteById(productId);
  },
};
