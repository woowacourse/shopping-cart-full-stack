import { AppError } from '../../errors/AppError.js';
import { cartItemRepository } from '../cart/cartItem.repository.js';
import { Product } from './product.model.js';
import { productRepository } from './product.repository.js';

type productParams = {
  productName: string;
  productPrice: number;
  remainingQuantity: number;
  imageUrl?: string;
};

export const productService = {
  addProduct(params: productParams) {
    // 필드 검사
    productFieldValidate(params);

    const product = new Product({ productId: crypto.randomUUID(), ...params });
    productRepository.save(product);
    return { productId: product.productId };
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
};

const productFieldValidate = (params: productParams) => {
  if (params.productName.trim() === '')
    throw new AppError(
      400,
      'INVALID_PRODUCT_NAME',
      '유효하지 않은 상품 이름입니다.',
    );
  if (params.productPrice <= 0)
    throw new AppError(
      400,
      'INVALID_PRODUCT_PRICE',
      '유효하지 않은 상품 가격입니다.',
    );
  if (!params.remainingQuantity)
    throw new AppError(
      400,
      'INVALID_REMAINING_QUANTITY',
      '유효하지 않은 상품 수량입니다.',
    );
  if (params.imageUrl && params.imageUrl.trim() === '')
    throw new AppError(
      400,
      'INVALID_IMAGE_URL',
      '유효하지 않은 이미지 경로입니다.',
    );
};
