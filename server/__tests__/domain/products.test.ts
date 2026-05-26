import { describe, expect, test } from '@jest/globals';

describe('상품 도메인 테스트', () => {
  test('상품명은 1자 이상 100자 이하이다.', () => {
    //given
    const data = {
      name: '나이키',
      price: 1000,
      image: 'img/test',
    };

    //when
    const product = new Product(data);

    //then
    expect(product.getProduct().name).toBe('나이키');
  });
});
