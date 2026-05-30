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
      message: string;
    };

type DeleteProductResult =
  | {
      status: 'deleted';
    }
  | {
      status: 'notFound';
    };

export const isValidProductName = (name: unknown) => {
  return typeof name === 'string' && name.length > 0 && name.length <= PRODUCT_NAME_MAX_LENGTH;
};

export const isValidPrice = (price: unknown) => {
  return typeof price === 'number' && Number.isFinite(price) && price > 0;
};

export const isValidImageUrl = (imageUrl: unknown) => {
  return typeof imageUrl === 'string' && imageUrl.length > 0;
};

export const isCreateProductRequestBody = (body: unknown): body is CreateProductRequestBody => {
  return typeof body === 'object' && body !== null;
};

export const isValidCreateProductBody = (body: unknown): body is CreateProductRequestBody => {
  if (!isCreateProductRequestBody(body)) {
    return false;
  }

  const {name, price, imageUrl} = body;

  return isValidProductName(name) && isValidPrice(price) && isValidImageUrl(imageUrl);
};

export const productService = {
  getProducts() {
    return products.findAll();
  },

  createProduct(body: unknown): CreateProductResult {
    if (!isValidCreateProductBody(body)) {
      return {
        status: 'invalid',
        message: '상품 이름, 가격, 이미지 URL을 올바르게 입력해주세요.',
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
