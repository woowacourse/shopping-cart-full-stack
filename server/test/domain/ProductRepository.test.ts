import { ProductInput } from "../../src/repositories/Product";
import ProductRepository from "../../src/repositories/ProductRepository";

describe("ProductRepository 단위 테스트", () => {
  let repository: ProductRepository;

  beforeEach(() => {
    repository = new ProductRepository();
  });

  it("getProducts() : 저장소에 데이터가 없을 경우 빈 배열 반환", () => {
    // When
    const result = repository.getProducts();

    // Then
    expect(result).toEqual([]);
  });

  it("addProduct() : 저장소에 Product를 추가하고 개수에 맞게 들어가있는가 확인", () => {
    // Given
    const newProductInput: ProductInput = {
      name: "아메리카노",
      price: 4500,
      thumbnailUrl: "url",
      totalQuantity: 50,
    };

    // When
    repository.addProduct(newProductInput);
    const result = repository.getProducts();

    // Then
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("아메리카노");
  });

  it("findById() : Id를 통해 적절한 Product를 찾을 수 있는가 확인", () => {
    // Given
    const targetProductInput: ProductInput = {
      name: "카페라떼",
      price: 5000,
      thumbnailUrl: "url",
      totalQuantity: 50,
    };

    const addedProduct = repository.addProduct(targetProductInput);
    const targetId = addedProduct.productId; // 자동 발급된 ID 추출

    // When
    const foundProduct = repository.findById(targetId);
    const notFoundProduct = repository.findById(999);

    // Then
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe("카페라떼");
    expect(foundProduct?.productId).toBe(targetId);

    expect(notFoundProduct).toBeNull();
  });

  it("deleteById() : Id를 통해 적절한 Product를 삭제할 수 있는가 확인", () => {
    // Given
    const productToDelete: ProductInput = {
      name: "에스프레소",
      price: 4000,
      thumbnailUrl: "url",
      totalQuantity: 30,
    };
    const addedProduct = repository.addProduct(productToDelete);
    const targetId = addedProduct.productId;

    // 초기 검증
    expect(repository.getProducts()).toHaveLength(1);

    // When
    repository.deleteById(targetId);

    // Then
    const result = repository.getProducts();
    expect(result).toHaveLength(0);
  });
});
