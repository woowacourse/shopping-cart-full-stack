import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { cartRepository } from "../repositories/CartRepository";
import { ProductData } from "../repositories/Product";
import { productRepository } from "../repositories/ProductRepository";

export const getProductsService = (): ProductData[] => {
  return productRepository.getProducts();
};

export const postProductsService = (newProducts: ProductData): ProductData => {
  const addedProduct = productRepository.addProduct(newProducts);
  if (!addedProduct)
    throw new NotFoundError(
      "NOT_FOUND_PRODUCT",
      ERROR_MESSAGE.NOT_FOUND_PRODUCT,
    );

  return addedProduct;
};

export const deleteProductsService = (productId: number): void => {
  if (!productId)
    throw new InvalidError(
      "INVALID_PRODUCT_ID",
      ERROR_MESSAGE.INVALID_PRODUCT_ID,
    );

  const product = productRepository.findById(productId);
  if (!product)
    throw new NotFoundError(
      "NOT_FOUND_PRODUCT",
      ERROR_MESSAGE.NOT_FOUND_PRODUCT,
    );

  productRepository.deleteById(productId);
  cartRepository.deleteByProductId(productId);
};
