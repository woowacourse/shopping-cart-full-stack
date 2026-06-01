import AppError from '../errors/AppError.js';
import ProductManager, { Product } from '../model/ProductManager.js';

const mockProduct: Product = {
  name: '아디다스양말',
  price: 5000,
  imgUrl: 'https://abc.com',
  quantity: 10,
};

describe('상품 추가 기능 테스트', () => {
  test('상품 1개를 추가하면, 해당 상품이 상품 목록에 추가된다.', () => {
    // given
    const productManager = new ProductManager();

    // when
    productManager.addProduct(mockProduct);

    // then
    expect(
      productManager
        .getProducts()
        .find((product) => product.name === mockProduct.name),
    ).not.toBe(undefined);
  });

  test('처음 추가된 상품의 id는 1이고, 상품이 1개씩 추가될 때마다 1씩 증가한다.', () => {
    // given
    const productManager = new ProductManager();

    // when
    productManager.addProduct(mockProduct);
    productManager.addProduct(mockProduct);
    productManager.addProduct(mockProduct);

    // then
    expect(
      productManager
        .getProducts()
        .every((product, index) => product.id === index + 1),
    ).toBe(true);
  });
});

describe('상품 추가 예외 테스트', () => {
  // given
  let productManager: ProductManager;

  beforeEach(() => {
    productManager = new ProductManager();
  });

  test('상품명이 100자를 초과하면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        name: '아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말',
      });
    }).toThrow(new AppError('PRODUCT_NAME_LENGTH_EXCEEDED'));
  });

  test('가격이 숫자가 아니면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        price: 'abc',
      });
    }).toThrow(new AppError('INVALID_PRODUCT_PRICE_TYPE'));
  });

  test('가격이 숫자가 아니면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        price: '2',
      });
    }).toThrow(new AppError('INVALID_PRODUCT_PRICE_TYPE'));
  });

  test('가격이 0 이하이면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        price: 0,
      });
    }).toThrow(new AppError('INVALID_PRODUCT_PRICE_TYPE'));
  });

  test('재고 수량이 범위(1~99)를 벗어날 경우 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        quantity: 0,
      });
    }).toThrow(new AppError('INVALID_PRODUCT_QUANTITY_RANGE'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        quantity: 100,
      });
    }).toThrow(new AppError('INVALID_PRODUCT_QUANTITY_RANGE'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        quantity: '2',
      });
    }).toThrow(new AppError('INVALID_PRODUCT_QUANTITY_RANGE'));
  });

  test('상품명 필드가 누락된 경우 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        name: '',
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_NAME'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        name: null,
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_NAME'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        name: undefined,
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_NAME'));
  });

  test('상품 가격 필드가 누락된 경우 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        price: null,
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_PRICE'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        price: undefined,
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_PRICE'));
  });

  test('재고 필드가 누락된 경우 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        quantity: '',
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_QUANTITY'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        quantity: null,
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_QUANTITY'));

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        quantity: undefined,
      });
    }).toThrow(new AppError('EMPTY_PRODUCT_QUANTITY'));
  });
});

describe('상품 삭제 기능 테스트', () => {
  test('상품 1개를 삭제하면, 해당 상품이 상품 목록에서 삭제된다.', () => {
    // given
    const productManager = new ProductManager();
    productManager.addProduct(mockProduct);
    const firstAddedProductId = 1;

    // when
    productManager.deleteProduct(firstAddedProductId);

    // then
    expect(
      productManager
        .getProducts()
        .find((product) => product.id === firstAddedProductId),
    ).toBe(undefined);
  });
});

describe('상품 삭제 예외 테스트', () => {
  test('존재하지 않는 상품 삭제 시 에러를 발생시킨다.', () => {
    // given
    const productManager = new ProductManager();
    productManager.addProduct(mockProduct);

    const wrongProductId = 2;

    // when & then
    expect(() => {
      productManager.deleteProduct(wrongProductId);
    }).toThrow(new AppError('PRODUCT_NOT_EXIST'));
  });
});
