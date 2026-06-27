import { BadRequestError } from '../errors.js';
import { Product } from './Product.js';

const validateQuantity = (quantity: number) => {
  if (quantity >= 1 && quantity <= 99 && Number.isInteger(quantity)) return;

  throw new BadRequestError({
    errorCode: 'INVALID',
    errorMessage: '수량은 1 이상 99 이하의 정수여야 합니다.',
    data: [{ type: 'quantity', errorCode: 'INVALID_RANGE' }],
  });
};

/**
 * 장바구니 항목 도메인 모델. 생성자를 통과한 인스턴스는 quantity가 1~99 범위의 정수임을 보장한다.
 * quantity의 누락/타입 검증(MISSING_FIELD, TYPE_MISSMATCH)은 이 클래스 이전 단계(서비스)에서 처리한다.
 */
export class CartItem {
  readonly product: Product;
  readonly quantity: number;
  readonly checkStatus: boolean;

  constructor(product: Product, quantity: number, checkStatus: boolean) {
    validateQuantity(quantity);

    this.product = product;
    this.quantity = quantity;
    this.checkStatus = checkStatus;
  }
}
