import { cartItems, products } from "../db.js";
import {
  DuplicateNameError,
  InvalidInputError,
  NotFoundError,
} from "../errors/HttpError.js";
import { Product } from "../models/Product.js";
import type { CreateProductRequestBody } from "../type.js";

const PRODUCT_NAME_MAX_LENGTH = 100;

const isValidProductName = (name: unknown) => {
  return (
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= PRODUCT_NAME_MAX_LENGTH
  );
};

const isValidPrice = (price: unknown) => {
  return typeof price === "number" && Number.isFinite(price) && price > 0;
};

const isValidImageUrl = (imageUrl: unknown) => {
  return typeof imageUrl === "string" && imageUrl.length > 0;
};

const isCreateProductRequestBody = (
  body: unknown,
): body is CreateProductRequestBody => {
  return typeof body === "object" && body !== null;
};

const isValidCreateProductBody = (
  body: unknown,
): body is CreateProductRequestBody => {
  if (!isCreateProductRequestBody(body)) {
    return false;
  }

  const { name, price, imageUrl } = body;

  return (
    isValidProductName(name) && isValidPrice(price) && isValidImageUrl(imageUrl)
  );
};

export const productService = {
  getProducts() {
    return products.findAll();
  },

  createProduct(body: unknown): Product {
    if (!isValidCreateProductBody(body)) {
      throw new InvalidInputError();
    }

    const { name, price, imageUrl } = body;

    if (products.hasName(name)) {
      throw new DuplicateNameError();
    }

    const newId = products.getNextId();
    const newProduct = new Product(newId, name, price, imageUrl);

    products.add(newProduct);

    return newProduct;
  },

  deleteProduct(id: string): void {
    if (!products.findById(id)) {
      throw new NotFoundError();
    }
    cartItems.deleteByProductId(id);
    products.deleteById(id);
  },
};
