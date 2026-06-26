import { NotFoundError, BadRequestError } from '../errors.js';
import * as productsRepository from '../repositories/ProductsRepository.js';
import { Product } from '../models/Product.js';
import type { ProductAttributes } from '../models/Product.js';
import type { FieldError } from '../response.js';

const REQUIRED_FIELDS: Array<keyof ProductAttributes> = ['name', 'price', 'imgUrl'];

const findMissingFields = (product: Partial<ProductAttributes>): FieldError[] => {
    return REQUIRED_FIELDS.filter((field) => product[field] === undefined).map((field) => ({
        type: field,
        errorCode: 'REQUIRED',
    }));
};

const findTypeMismatchMessage = (product: ProductAttributes): string | null => {
    if (typeof product.name !== 'string') return '상품명은 문자열이어야 합니다.';
    if (typeof product.price !== 'number') return '가격은 숫자여야 합니다.';
    if (typeof product.imgUrl !== 'string') return '상품 이미지는 문자열이어야 합니다.';
    return null;
};

// 요청 body의 모양(필드 존재 여부, 타입)만 검증한다. 도메인 유효성(길이/범위)은 Product 생성자가 검증한다.
const validateRequestShape = (product: Partial<ProductAttributes>) => {
    const missingFields = findMissingFields(product);

    if (missingFields.length > 0) {
        throw new BadRequestError({
            errorCode: 'MISSING_FIELD',
            errorMessage: '필수 필드가 누락되었습니다.',
            data: missingFields,
        });
    }

    const typeMismatchMessage = findTypeMismatchMessage(product as ProductAttributes);

    if (typeMismatchMessage) {
        throw new BadRequestError({ errorCode: 'TYPE_MISSMATCH', errorMessage: typeMismatchMessage });
    }
};

export const getProducts = async () => {
    return await productsRepository.getAll();
};

export const insertProduct = async (product: Partial<ProductAttributes>) => {
    validateRequestShape(product);

    const id = productsRepository.generateId();
    const newProduct = new Product(id, product as ProductAttributes);

    return await productsRepository.insert(newProduct);
};

export const deleteProduct = async (productId: Product['id']) => {
    const deleted = await productsRepository.deleteById(productId);

    if (!deleted) {
        throw new NotFoundError({
            errorCode: 'ROUTE_NOT_FOUND',
            errorMessage: '존재하지 않는 상품입니다.',
        });
    }

    return deleted;
};
