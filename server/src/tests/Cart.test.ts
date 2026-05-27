import Cart from "../models/Cart.js";

describe("Cart Tests", () => {
  test("카트는 상품id와 수량을 전달받으면 해당 데이터를 items에 업데이트한다.", () => {
    const cart = new Cart();
    cart.updateItem("1234-1234", 10);
    expect(cart.getItem("1234-1234")).toBe(10);
  });

  test("카트내 모든 아이템들을 반환한다.", () => {
    const cart = new Cart();
    cart.updateItem("123", 10);
    cart.updateItem("456", 20);
    expect(cart.getAllItems()).toEqual([
      { product_id: "123", quantity: 10 },
      { product_id: "456", quantity: 20 },
    ]);
  });
});
