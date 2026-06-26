import {INVALID_QUANTITY_MESSAGE, isValidQuantity} from '../cartPolicy.js';

describe('cartPolicy', () => {
  test('1 이상 99 이하의 정수이면 유효한 수량이다', () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(99)).toBe(true);
  });

  test('정수가 아니거나 범위를 벗어나면 유효하지 않은 수량이다', () => {
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(100)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false);
    expect(isValidQuantity('1')).toBe(false);
  });

  test('수량 검증 실패 메시지를 제공한다', () => {
    expect(INVALID_QUANTITY_MESSAGE).toBe('수량은 1 이상 99 이하의 정수여야 합니다.');
  });
});
