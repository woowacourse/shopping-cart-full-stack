export const INVALID_QUANTITY_MESSAGE = '수량은 1 이상 99 이하의 정수여야 합니다.';

export const isValidQuantity = (quantity: unknown) => {
  return typeof quantity === 'number' && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
};
