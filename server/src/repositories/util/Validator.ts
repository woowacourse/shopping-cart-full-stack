import { InvalidError } from "../../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../../errors/ErrorMessage";
import { ProductInput } from "../Product";

export const validateQuantity = (quantity: number): void => {
  if (Number.isNaN(quantity) || quantity < 1 || quantity > 99)
    throw new InvalidError(ERROR_MESSAGE.INVALID_QUANTITY_RANGE);
};

export const validateProductData = (data: ProductInput): void => {
  validateQuantity(data.totalQuantity);
  if (!data.name || data.name.length > 100)
    throw new InvalidError(ERROR_MESSAGE.INVALID_NAME);
  if (typeof data.price !== "number" || Number.isNaN(data.price) || data.price <= 0)
    throw new InvalidError(ERROR_MESSAGE.INVALID_PRICE);
  if (!data.thumbnailUrl)
    throw new InvalidError(ERROR_MESSAGE.INVALID_THUMBNAIL_URL);
};
