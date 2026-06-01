import AppError from "../errors/AppError.js";
import CartService from "../modules/cart/cart.service.js";
import ProductService from "../modules/product/product.service.js";
import { InMemoryCartRepository } from "../modules/cart/cart.repository.js";
import { InMemoryProductRepository } from "../modules/product/product.repository.js";

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
  let cartId: number;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    cartRepository = new InMemoryCartRepository();
    productService = new ProductService(productRepository, cartRepository);
    cartService = new CartService(cartRepository, productRepository);
    cartId = cartService.addCart();
  });

  test("장바구니를 추가하면 생성된 장바구니 id를 반환한다.", () => {
    // when
    const newCartId = cartService.addCart();

    // then
    expect(newCartId).toBe(2);
  });

  test("장바구니에 상품을 추가하면 상품 id를 반환한다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);

    // when
    const addedProductId = cartService.addCartItem(cartId, productId, 2);

    // then
    expect(addedProductId).toBe(productId);
  });

  test("장바구니 상품 조회 시 상품 정보와 수량을 함께 반환한다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(cartId, productId, 2);

    // when
    const cartItems = cartService.getCartItems(cartId);

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
    cartService.addCartItem(cartId, productId, 2);
    const updateItemCount = 5;

    // when
    const result = cartService.updateItemCount(
      cartId,
      productId,
      updateItemCount,
    );

    // then
    expect(result).toEqual({
      productId,
      itemCount: updateItemCount,
    });
    expect(cartRepository.findById(cartId)?.toJsonCartItems()).toEqual([
      {
        productId,
        itemCount: updateItemCount,
      },
    ]);
  });

  test("장바구니에 존재하지 않는 상품의 수량을 변경하면 에러를 발생시킨다.", () => {
    // given
    const notInCartProductId = productService.addProduct({
      ...mockProduct,
      name: "나이키 양말",
    });

    // when & then
    expect(() => {
      cartService.updateItemCount(cartId, notInCartProductId, 2);
    }).toThrow(new AppError("PRODUCT_NOT_EXIST_IN_CART"));
  });

  test("상품 재고보다 더 많은 수량으로 변경하면 에러를 발생시킨다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(cartId, productId, 2);
    const overItemCount = mockProduct.quantity + 1;

    // when & then
    expect(() => {
      cartService.updateItemCount(cartId, productId, overItemCount);
    }).toThrow(new AppError("PRODUCT_ORDER_COUNT_EXCEEDED"));
  });

  test("상품 재고보다 더 많은 수량으로 장바구니에 추가하면 에러를 발생시킨다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(cartId, productId, 2);
    const overAddItemCount = mockProduct.quantity;

    // when & then
    expect(() => {
      cartService.addCartItem(cartId, productId, overAddItemCount);
    }).toThrow(new AppError("PRODUCT_ORDER_COUNT_EXCEEDED"));
  });

  test("장바구니 상품을 삭제하면 장바구니 목록에서 삭제된다.", () => {
    // given
    const productId = productService.addProduct(mockProduct);
    cartService.addCartItem(cartId, productId, 2);

    // when
    cartService.deleteCartItem(cartId, productId);

    // then
    expect(cartRepository.findById(cartId)?.toJsonCartItems()).toEqual([]);
  });

  test("장바구니에 존재하지 않는 상품을 삭제하면 에러를 발생시킨다.", () => {
    // given
    const wrongProductId = 999999999;

    // when & then
    expect(() => {
      cartService.deleteCartItem(cartId, wrongProductId);
    }).toThrow(new AppError("PRODUCT_NOT_EXIST_IN_CART"));
  });

  test("존재하지 않는 장바구니에 상품을 추가하면 에러를 발생시킨다.", () => {
    // given
    const wrongCartId = 999999999;
    const productId = productService.addProduct(mockProduct);

    // when & then
    expect(() => {
      cartService.addCartItem(wrongCartId, productId, 2);
    }).toThrow(new AppError("CART_NOT_EXIST"));
  });
});
