import ProductRepository from '../../src/repositories/ProductRepository.ts';

describe('ProductRepository - getProducts() 단위 테스트', () => {
  it('저장소에 데이터가 없을 경우 빈 배열 반환', () => {
    // Given
    const repository = new ProductRepository();

    // When
    const result = repository.getProducts();

    // Then
    expect(result).toEqual([]);
  });
  