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
  imageUrl;

  constructor(product: Type) {
    this.validator(product);

    this.productId = product.productId;
    this.productName = product.productName;
    this.productPrice = product.productPrice;
    this.remainingQuantity = product.remainingQuantity;
    this.imageUrl = product.imageUrl ?? '';
  }

  validator(product: Type) {
    if (product.productName.trim() === '') {
      throw new Error('상품 이름은 공백일 수 없습니다.');
    }
    if (product.productName.length > 100) {
      throw new Error('상품 이름은 100자를 초과할 수 없습니다.');
    }
    if (!Number.isFinite(product.productPrice)) {
      throw new Error('상품 가격은 숫자여야 합니다.');
    }
    if (product.productPrice <= 0) {
      throw new Error('상품 가격은 0원이 될 수 없습니다.');
    }
    if (!Number.isInteger(product.remainingQuantity)) {
      throw new Error('수량은 정수여야 합니다.');
    }
    if (product.remainingQuantity < 1 || product.remainingQuantity > 99) {
      throw new Error('수량은 1개 이상 99개 이하여야 합니다.');
    }
  }
}
