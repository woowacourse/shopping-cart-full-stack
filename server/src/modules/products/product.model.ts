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
    validateProductName(product.productName);
    validateProductPrice(product.productPrice);
    validateRemainingQuantity(product.remainingQuantity);
  }
}

const validateProductName = (productName: string) => {
  if (productName.trim() === '' || productName.length > 100)
    throwInvalidProductName();
};

const validateProductPrice = (productPrice: number) => {
  if (!Number.isFinite(productPrice) || productPrice <= 0)
    throwInvalidProductPrice();
};

const validateRemainingQuantity = (remainingQuantity: number) => {
  if (
    !Number.isInteger(remainingQuantity) ||
    remainingQuantity < 1 ||
    remainingQuantity > 99
  )
    throwInvalidRemainingQuantity();
};

const throwInvalidProductName = () => {
  throw new ModelError(
    'INVALID_PRODUCT_NAME',
    '유효하지 않은 상품 이름입니다.',
  );
};

const throwInvalidProductPrice = () => {
  throw new ModelError(
    'INVALID_PRODUCT_PRICE',
    '유효하지 않은 상품 가격입니다.',
  );
};

const throwInvalidRemainingQuantity = () => {
  throw new ModelError(
    'INVALID_REMAINING_QUANTITY',
    '유효하지 않은 상품 수량입니다.',
  );
};
