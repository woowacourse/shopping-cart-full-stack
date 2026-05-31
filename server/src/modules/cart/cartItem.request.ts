import { AppError } from '../../errors/AppError.js';

export type AddCartItemRequest = {
  productId: string;
  purchaseQuantity: number;
};

export type ChangePurchaseQuantityRequest = {
  purchaseQuantity: number;
};

export const parseAddCartItemRequest = (
  body: unknown,
): AddCartItemRequest => {
  if (!isRecord(body)) throwInvalidProductId();

  const requestBody = body as Record<string, unknown>;
  const productId = requestBody.productId;
  const purchaseQuantity = requestBody.purchaseQuantity;

  validateProductIdField(productId);
  validatePurchaseQuantityField(purchaseQuantity);

  return { productId, purchaseQuantity };
};

export const parseChangePurchaseQuantityRequest = (
  body: unknown,
): ChangePurchaseQuantityRequest => {
  if (!isRecord(body)) throwInvalidPurchaseQuantity();

  const requestBody = body as Record<string, unknown>;
  const purchaseQuantity = requestBody.purchaseQuantity;

  validatePurchaseQuantityField(purchaseQuantity);

  return { purchaseQuantity };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateProductIdField(
  productId: unknown,
): asserts productId is string {
  if (typeof productId !== 'string' || productId.trim() === '')
    throwInvalidProductId();
}

function validatePurchaseQuantityField(
  purchaseQuantity: unknown,
): asserts purchaseQuantity is number {
  if (typeof purchaseQuantity !== 'number') throwInvalidPurchaseQuantity();
}

const throwInvalidProductId = (): never => {
  throw new AppError(
    400,
    'INVALID_PRODUCT_ID',
    '유효하지 않은 상품 id입니다.',
  );
};

const throwInvalidPurchaseQuantity = (): never => {
  throw new AppError(
    400,
    'INVALID_PURCHASE_QUANTITY',
    '유효하지 않은 구매 수량입니다.',
  );
};
