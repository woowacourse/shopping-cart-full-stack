import CartRepository from "../../src/repositories/CartRepository";

describe("CartRepository 단위 테스트", () => {
  let repository: CartRepository;

  beforeEach(() => {
    repository = new CartRepository();
  });

  it("getCartProducts() : 저장소에 장바구니 데이터가 없을 경우 빈 배열 반환", () => {
    // When
    const result = repository.getCartProducts();

    // Then
    expect(result).toEqual([]);
  });

  it("addProductToCart() : 장바구니에 상품을 추가하고 개수와 데이터가 맞게 들어갔는지 확인", () => {
    // Given
    const targetProductId = 1;
    const targetQuantity = 3;

    // When
    const addedItem = repository.addProductToCart(targetProductId, targetQuantity);
    const result = repository.getCartProducts();

    // Then
    expect(result).toHaveLength(1);
    expect(addedItem.cartItemId).toBe(1);
    expect(addedItem.productId).toBe(targetProductId);
    expect(addedItem.quantity).toBe(targetQuantity);
  });

  it("changeQuantity() : 장바구니 아이템의 수량을 정상적으로 변경되는지 확인", () => {
    // Given
    const addedItem = repository.addProductToCart(1, 2);
    const targetId = addedItem.cartItemId;

    // When
    repository.changeQuantity(targetId, 5);

    // Then
    const result = repository.getCartProducts();
    expect(result[0].quantity).toBe(5);
  });

  it("deleteByCartId() : cartItemId를 통해 특정 장바구니 아이템을 삭제할 수 있는지 확인", () => {
    // Given
    const addedItem = repository.addProductToCart(1, 3);
    const targetId = addedItem.cartItemId;
    expect(repository.getCartProducts()).toHaveLength(1);

    // When
    repository.deleteByCartId(targetId);

    // Then
    const result = repository.getCartProducts();
    expect(result).toHaveLength(0);
  });

  it("deleteByProductId() : productId에 해당하는 모든 장바구니 아이템이 삭제되는지 확인 (Cascading)", () => {
    // Given
    repository.addProductToCart(1, 2); // 삭제 대상
    repository.addProductToCart(2, 5);
    repository.addProductToCart(1, 3); // 삭제 대상

    expect(repository.getCartProducts()).toHaveLength(3);

    // When (productId 1번 삭제)
    repository.deleteByProductId(1);

    // Then
    const result = repository.getCartProducts();
    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe(2);
  });
});
