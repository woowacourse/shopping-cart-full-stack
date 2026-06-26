import { BadRequestError } from '../errors.js';
import type { FieldError } from '../response.js';

export interface ProductAttributes {
    name: string;
    price: number;
    imgUrl: string;
}

const findInvalidFields = ({ name, price }: ProductAttributes): FieldError[] => {
    const errors: FieldError[] = [];

    if (name.length < 1 || name.length > 100) {
        errors.push({ type: 'name', errorCode: 'INVALID_LENGTH' });
    }

    if (price <= 0 || !Number.isInteger(price)) {
        errors.push({ type: 'price', errorCode: 'INVALID_RANGE' });
    }

    return errors;
};

const validateAttributes = (attributes: ProductAttributes) => {
    const invalidFields = findInvalidFields(attributes);

    if (invalidFields.length === 0) return;

    throw new BadRequestError({
        errorCode: 'INVALID',
        errorMessage: '필드 값이 유효하지 않습니다.',
        data: invalidFields,
    });
};

/**
 * 상품 도메인 모델. 생성자를 통과한 인스턴스는 도메인 유효성(길이/범위)이 검증된 상태임을 보장한다.
 * 요청 body의 누락/타입 검증(MISSING_FIELD, TYPE_MISSMATCH)은 이 클래스 이전 단계(서비스)에서 처리한다.
 */
export class Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly imgUrl: string;

    constructor(id: string, attributes: ProductAttributes) {
        validateAttributes(attributes);

        this.id = id;
        this.name = attributes.name;
        this.price = attributes.price;
        this.imgUrl = attributes.imgUrl;
    }
}
