import AppError from "../errors/AppError.js";
import CartService from "../domain/cart/cart.service.js";
import ProductService from "../domain/product/product.service.js";
import { InMemoryCartRepository } from "../domain/cart/cart.repository.js";
import { InMemoryProductRepository } from "../domain/product/product.repository.js";

const mockProduct = {
  name: "아디다스 양말",
  price: 13000,
  imgUrl: "https://image-url.com",
  quantity: 10,
};

describe("장바구니 서비스 테스트", () => {
  let productRepository: InMemoryProductRepository;
  let cartRepository: InMemoryCartRepository;
  let productService: ProductService;
  let cartService: CartService;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    cartRepository = new InMemoryCartRepository();
    productService = new ProductService(productRepository, cartRepository);
    cartService = new CartService(cartRepository, productRepository);
  });

  test("장바구니에 상품을 추가하면 상품 id를 반환한다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);

    // when
    const addedProductId = cartService.addCartItem(productId, 2);

    // then
    expect(addedProductId).toBe(productId);
  });

  test("장바구니 상품 조회 시 상품 정보와 수량을 함께 반환한다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(productId, 2);

    // when
    const cartItems = cartService.getCartItems();

    // then
    expect(cartItems).toEqual([
      {
        id: productId,
        name: mockProduct.name,
        price: mockProduct.price,
        imgUrl: mockProduct.imgUrl,
        itemCount: 2,
      },
    ]);
  });

  test("장바구니 상품 수량 변경 성공 시 변경된 id와 itemCount를 반환한다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(productId, 2);
    const updateItemCount = 5;

    // when
    const result = cartService.updateItemCount(productId, updateItemCount);

    // then
    expect(result).toEqual({
      productId,
      itemCount: updateItemCount,
    });
    expect(cartRepository.findByProductId(productId)?.toJson()).toEqual({
      productId,
      itemCount: updateItemCount,
    });
  });

  test("장바구니에 존재하지 않는 상품의 수량을 변경하면 에러를 발생시킨다.", () => {
    // given
    const wrongProductId = 999999999;

    // when & then
    expect(() => {
      cartService.updateItemCount(wrongProductId, 2);
    }).toThrow(new AppError("PRODUCT_NOT_EXIST_IN_CART"));
  });

  test("상품 재고보다 더 많은 수량으로 변경하면 에러를 발생시킨다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(productId, 2);
    const overItemCount = mockProduct.quantity + 1;

    // when & then
    expect(() => {
      cartService.updateItemCount(productId, overItemCount);
    }).toThrow(new AppError("PRODUCT_ORDER_COUNT_EXCEEDED"));
  });

  test("장바구니 상품을 삭제하면 장바구니 목록에서 삭제된다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(productId, 2);

    // when
    cartService.deleteCartItem(productId);

    // then
    expect(cartRepository.findByProductId(productId)).toBeUndefined();
  });

  test("장바구니에 존재하지 않는 상품을 삭제하면 에러를 발생시킨다.", () => {
    // given
    const wrongProductId = 999999999;

    // when & then
    expect(() => {
      cartService.deleteCartItem(wrongProductId);
    }).toThrow(new AppError("PRODUCT_NOT_EXIST_IN_CART"));
  });
});
