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
  const product = new Product(data);

  test('상품명은 1자 이상 100자 이하이다.', () => {
    //then
    expect(product.getProduct().name).toBe('나이키');
  });

  test('가격은 0보다 큰 숫자이다.', () => {
    //then
    expect(product.getProduct().price).toBe(1000);
  });
});
