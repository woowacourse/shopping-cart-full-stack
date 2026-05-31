import { describe, expect, test } from '@jest/globals';
import Product from '../../src/domain/Product';

describe('상품 도메인 테스트', () => {
  //given
  const data = {
    name: '나이키',
    price: 1000,
    image: 'img/test',
  };

  //when
  const product = new Product('testId', data);

  test('상품명은 1자 이상 100자 이하이다.', () => {
    //then
    expect(product.name).toBe('나이키');
  });

  test('가격은 0보다 큰 숫자이다.', () => {
    //then
    expect(product.price).toBe(1000);
  });
});

describe('상품 도메인 예외 테스트', () => {
  test('상품명이 공백이면 예외 처리한다.', () => {
    const data = {
      name: '',
      price: 1000,
      image: 'img/test',
    };

    expect(() => new Product('testId', data)).toThrow('상품명이 공백입니다.');
  });

  test('상품명이 100자 초과면 예외 처리한다.', () => {
    const data = {
      name: 'a'.repeat(101),
      price: 1000,
      image: 'img/test',
    };

    expect(() => new Product('testId', data)).toThrow(
      '상품명이 100자를 초과합니다.',
    );
  });

  test('가격이 0원 이하이면 예외 처리한다.', () => {
    const data = {
      name: '나이키',
      price: 0,
      image: 'img/test',
    };

    expect(() => new Product('testId', data)).toThrow('가격은 1원 이상입니다.');
  });

  test('가격이 숫자가 아니면 예외 처리한다.', () => {
    const data = {
      name: '나이키',
      price: 'abc' as unknown as number,
      image: 'img/test',
    };

    expect(() => new Product('testId', data)).toThrow('가격은 숫자여야 합니다.');
  });
});
