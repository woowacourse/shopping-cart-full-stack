import { AppError } from '../../errors/AppError.js';
import { ModelError } from '../../errors/ModelError.js';
import { Product } from './product.model.js';
import type { ProductRepository } from './product.repository.js';

type ProductParams = {
  productName: string;
  productPrice: number;
  remainingQuantity: number;
  imageUrl?: string;
};

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  addProduct(params: ProductParams) {
    // 필드 검사
    validateProductFields(params);

    try {
      const product = new Product({
        productId: crypto.randomUUID(),
        ...params,
      });
      this.productRepository.save(product);
      return { productId: product.productId };
    } catch (error) {
      if (error instanceof ModelError) {
        throw new AppError(400, error.code, error.message);
      }

      throw error;
    }
  }

  getProducts() {
    return this.productRepository.findAll();
  }

  deleteProduct(productId: string) {
    const product = this.productRepository.findById(productId);

    if (!product)
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');

    this.productRepository.deleteById(productId);
  }
}

const validateProductFields = (params: ProductParams) => {
  if (typeof params.productName !== 'string') {
    throw new AppError(
      400,
      'INVALID_PRODUCT_NAME',
      '유효하지 않은 상품 이름입니다.',
    );
  }

  if (typeof params.productPrice !== 'number') {
    throw new AppError(
      400,
      'INVALID_PRODUCT_PRICE',
      '유효하지 않은 상품 가격입니다.',
    );
  }

  if (typeof params.remainingQuantity !== 'number') {
    throw new AppError(
      400,
      'INVALID_REMAINING_QUANTITY',
      '유효하지 않은 상품 수량입니다.',
    );
  }

  if (
    params.imageUrl !== undefined &&
    (typeof params.imageUrl !== 'string' || params.imageUrl.trim() === '')
  ) {
    throw new AppError(
      400,
      'INVALID_IMAGE_URL',
      '유효하지 않은 이미지 경로입니다.',
    );
  }
};
