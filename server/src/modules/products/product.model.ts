import { ModelError } from '../../errors/ModelError.js';

export type Type = {
  productId: string;
  productName: string;
  productPrice: number;
  remainingQuantity: number;
  imageUrl?: string;
};

export class Product {
  productId;
  productName;
  productPrice;
  remainingQuantity;
  imageUrl?;

  constructor(product: Type) {
    this.validator(product);

    this.productId = product.productId;
    this.productName = product.productName;
    this.productPrice = product.productPrice;
    this.remainingQuantity = product.remainingQuantity;
    this.imageUrl = product.imageUrl;
  }

  validator(product: Type) {
    if (product.productName.trim() === '') {
      throw new ModelError(
        'INVALID_PRODUCT_NAME',
        '유효하지 않은 상품 이름입니다.',
      );
    }
    if (product.productName.length > 100) {
      throw new ModelError(
        'INVALID_PRODUCT_NAME',
        '유효하지 않은 상품 이름입니다.',
      );
    }
    if (!Number.isFinite(product.productPrice)) {
      throw new ModelError(
        'INVALID_PRODUCT_PRICE',
        '유효하지 않은 상품 가격입니다.',
      );
    }
    if (product.productPrice <= 0) {
      throw new ModelError(
        'INVALID_PRODUCT_PRICE',
        '유효하지 않은 상품 가격입니다.',
      );
    }
    if (!Number.isInteger(product.remainingQuantity)) {
      throw new ModelError(
        'INVALID_REMAINING_QUANTITY',
        '유효하지 않은 상품 수량입니다.',
      );
    }
    if (product.remainingQuantity < 1 || product.remainingQuantity > 99) {
      throw new ModelError(
        'INVALID_REMAINING_QUANTITY',
        '유효하지 않은 상품 수량입니다.',
      );
    }
  }
}
