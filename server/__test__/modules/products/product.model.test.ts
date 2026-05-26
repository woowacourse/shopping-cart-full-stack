import { Product } from '../../../src/modules/products/product.model.js';

describe('product 모델 테스트', () => {
  test('상품 생성', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜라',
      productPrice: 1300,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    };
    const product = new Product(mockProduct);

    expect(product.productId).toEqual('1');
    expect(product.productName).toEqual('콜라');
    expect(product.productPrice).toEqual(1300);
    expect(product.remainingQuantity).toEqual(25);
    expect(product.imageUrl).toEqual('src/assets/coke.png');
  });

  test('상품 가격이 0원인 경우 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜라',
      productPrice: 0,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('상품 가격은 0원이 될 수 없습니다.');
  });

  test('상품 이름이 공백인 경우 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: ' ',
      productPrice: 1300,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('상품 이름은 공백일 수 없습니다.');
  });

  test('상품 이름이 100자를 초과하면 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜'.repeat(101),
      productPrice: 1300,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('상품 이름은 100자를 초과할 수 없습니다.');
  });

  test('상품 수량이 0일때 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜라',
      productPrice: 1300,
      remainingQuantity: 0,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('수량은 1개 이상 99개 이하여야 합니다.');
  });

  test('상품 수량이 100일때 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜라',
      productPrice: 1300,
      remainingQuantity: 100,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('수량은 1개 이상 99개 이하여야 합니다.');
  });

  test('상품 수량이 정수가 아닐 때 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜라',
      productPrice: 1300,
      remainingQuantity: 1.5,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('수량은 정수여야 합니다.');
  });

  test('상품 가격이 숫자가 아닐 때 에러 발생', () => {
    const mockProduct = {
      productId: '1',
      productName: '콜라',
      productPrice: NaN,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    };

    expect(() => {
      new Product(mockProduct);
    }).toThrow('상품 가격은 숫자여야 합니다.');
  });
});
