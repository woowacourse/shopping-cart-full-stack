import { InvalidError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductInput } from "../repositories/Product";

export const validateQuantity = (quantity: number): void => {
  if (Number.isNaN(quantity) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99)
    throw new InvalidError(ERROR_MESSAGE.INVALID_QUANTITY_RANGE);
};

export const validateId = (id: number): void => {
  if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0)
    throw new InvalidError(ERROR_MESSAGE.INVALID_ID);
};

export const validateProductData = (data: ProductInput): void => {
  validateQuantity(data.totalQuantity);
  if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 100)
    throw new InvalidError(ERROR_MESSAGE.INVALID_NAME);
  if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price <= 0)
    throw new InvalidError(ERROR_MESSAGE.INVALID_PRICE);
  if (typeof data.thumbnailUrl !== 'string' || !data.thumbnailUrl.trim())
    throw new InvalidError(ERROR_MESSAGE.INVALID_THUMBNAIL_URL);
};
