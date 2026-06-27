import {
  DuplicateNameError,
  InvalidInputError,
  NotFoundError,
} from "../errors/HttpError.js";
import type { CartItemRepository } from "../repositories/CartItemRepository.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";
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

export interface ProductServiceDeps {
  productRepository: ProductRepository;
  cartItemRepository: CartItemRepository;
}

export const createProductService = ({
  productRepository,
  cartItemRepository,
}: ProductServiceDeps) => ({
  async getProducts() {
    return productRepository.findAll();
  },

  async createProduct(body: unknown) {
    if (!isValidCreateProductBody(body)) {
      throw new InvalidInputError();
    }

    const { name, price, imageUrl } = body;

    if (await productRepository.existsByName(name)) {
      throw new DuplicateNameError();
    }

    return productRepository.create({ name, price, imageUrl });
  },

  async deleteProduct(id: string): Promise<void> {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError();
    }

    await cartItemRepository.deleteByProductId(id);
    await productRepository.deleteById(id);
  },
});

export type ProductService = ReturnType<typeof createProductService>;
