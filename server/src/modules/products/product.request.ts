import { AppError } from '../../errors/AppError.js';

export type ProductRequest = {
  productName: string;
  productPrice: number;
  remainingQuantity: number;
  imageUrl?: string;
};

export const parseProductRequest = (body: unknown): ProductRequest => {
  if (!isRecord(body)) throwInvalidProductName();

  const requestBody = body as Record<string, unknown>;
  const productName = requestBody.productName;
  const productPrice = requestBody.productPrice;
  const remainingQuantity = requestBody.remainingQuantity;
  const imageUrl = requestBody.imageUrl;

  validateProductNameField(productName);
  validateProductPriceField(productPrice);
  validateRemainingQuantityField(remainingQuantity);
  validateImageUrlField(imageUrl);

  return {
    productName,
    productPrice,
    remainingQuantity,
    imageUrl,
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateProductNameField(
  productName: unknown,
): asserts productName is string {
  if (typeof productName !== 'string') throwInvalidProductName();
}

function validateProductPriceField(
  productPrice: unknown,
): asserts productPrice is number {
  if (typeof productPrice !== 'number') throwInvalidProductPrice();
}

function validateRemainingQuantityField(
  remainingQuantity: unknown,
): asserts remainingQuantity is number {
  if (typeof remainingQuantity !== 'number') throwInvalidRemainingQuantity();
}

function validateImageUrlField(
  imageUrl: unknown,
): asserts imageUrl is string | undefined {
  if (imageUrl === undefined) return;
  if (typeof imageUrl !== 'string' || imageUrl.trim() === '')
    throwInvalidImageUrl();
}

const throwInvalidProductName = (): never => {
  throw new AppError(
    400,
    'INVALID_PRODUCT_NAME',
    '유효하지 않은 상품 이름입니다.',
  );
};

const throwInvalidProductPrice = (): never => {
  throw new AppError(
    400,
    'INVALID_PRODUCT_PRICE',
    '유효하지 않은 상품 가격입니다.',
  );
};

const throwInvalidRemainingQuantity = (): never => {
  throw new AppError(
    400,
    'INVALID_REMAINING_QUANTITY',
    '유효하지 않은 상품 수량입니다.',
  );
};

const throwInvalidImageUrl = (): never => {
  throw new AppError(
    400,
    'INVALID_IMAGE_URL',
    '유효하지 않은 이미지 경로입니다.',
  );
};
