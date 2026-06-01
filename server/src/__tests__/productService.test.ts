import AppError from "../errors/AppError.js";
import ProductService from "../modules/product/product.service.js";
import { InMemoryProductRepository } from "../modules/product/product.repository.js";
import { InMemoryCartRepository } from "../modules/cart/cart.repository.js";

const mockProduct = {
  name: "아디다스 양말",
  price: 13000,
  imgUrl: "https://image-url.com",
  quantity: 10,
};

describe("상품 서비스 테스트", () => {
  let productRepository: InMemoryProductRepository;
  let cartRepository: InMemoryCartRepository;
  let productService: ProductService;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    cartRepository = new InMemoryCartRepository();
    productService = new ProductService(productRepository, cartRepository);
  });

  test("상품 1개를 추가하면 생성된 상품 id를 반환한다.", () => {
    // when
    const productId = productService.addProduct(mockProduct);

    // then
    expect(productId).toBe(1);
  });

  test("상품 1개를 추가하면 상품 목록에서 조회된다.", () => {
    // when
    const productId = productService.addProduct(mockProduct);

    // then
    expect(productService.getProducts()).toEqual([
      {
        id: productId,
        ...mockProduct,
      },
    ]);
  });

  test("상품 1개를 삭제하면 상품 목록에서 삭제된다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);

    // when
    productService.deleteProduct(productId);

    // then
    expect(productService.getProducts()).toEqual([]);
  });

  test("상품 1개를 삭제하면 장바구니에 담긴 상품도 같이 삭제된다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    const cart = cartRepository.create();
    cart.addCartItem(productId, 2);

    // when
    productService.deleteProduct(productId);

    // then
    expect(cart.toJsonCartItems()).toEqual([]);
  });

  test("존재하지 않는 상품을 삭제하면 에러를 발생시킨다.", () => {
    // given
    const wrongProductId = 999999999;

    // when & then
    expect(() => {
      productService.deleteProduct(wrongProductId);
    }).toThrow(new AppError("PRODUCT_NOT_EXIST"));
  });
});
