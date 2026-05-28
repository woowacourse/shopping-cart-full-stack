import {cartItems, products} from '../db.js';
import {Product} from '../models/Product.js';
import type {CreateProductRequestBody} from '../type.js';

const PRODUCT_NAME_MAX_LENGTH = 100;

type CreateProductResult =
  | {
      status: 'created';
      id: string;
    }
  | {
      status: 'duplicated';
    }
  | {
      status: 'invalid';
    };

type DeleteProductResult =
  | {
      status: 'deleted';
    }
  | {
      status: 'notFound';
    };

const isValidProductName = (name: unknown) => {
  return typeof name === 'string' && name.length > 0 && name.length <= PRODUCT_NAME_MAX_LENGTH;
};

const isValidPrice = (price: unknown) => {
  return typeof price === 'number' && Number.isFinite(price) && price > 0;
};

const isValidImageUrl = (imageUrl: unknown) => {
  return typeof imageUrl === 'string' && imageUrl.length > 0;
};

const isCreateProductRequestBody = (body: unknown): body is CreateProductRequestBody => {
  return typeof body === 'object' && body !== null;
};

const isValidCreateProductBody = (body: unknown): body is CreateProductRequestBody => {
  if (!isCreateProductRequestBody(body)) {
    return false;
  }

  const {name, price, imageUrl} = body;

  return isValidProductName(name) && isValidPrice(price) && isValidImageUrl(imageUrl);
};

export const productService = {
  getProducts() {
    return products.getAll();
  },

  createProduct(body: unknown): CreateProductResult {
    if (!isValidCreateProductBody(body)) {
      return {
        status: 'invalid',
      };
    }

    const {name, price, imageUrl} = body;

    if (products.hasName(name)) {
      return {
        status: 'duplicated',
      };
    }

    const newId = products.getNextId();

    products.add(new Product(newId, name, price, imageUrl));

    return {
      status: 'created',
      id: newId,
    };
  },

  deleteProduct(id: string): DeleteProductResult {
    if (!products.findById(id)) {
      return {
        status: 'notFound',
      };
    }

    cartItems.deleteByProductId(id);
    products.deleteById(id);

    return {
      status: 'deleted',
    };
  },
};
