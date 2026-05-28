import { createApp } from "../app.js";
import InMemoryStorage from "../storages/InMemoryStorage.js";
import Product from "../models/Product.js";
import request from "supertest";
import Cart from "../models/Cart.js";
import { ProductType } from "../models/Product.js";

describe("프로덕트 API 테스트", () => {
  const storage = new InMemoryStorage();
  const app = createApp(storage);
  const product1 = new Product("피자", 30000, "pizza.png");
  const product2 = new Product("치킨", 20000, "chicken.png");

  beforeEach(() => {
    storage.addItem("products", product1.getId(), product1);
    storage.addItem("products", product2.getId(), product2);
  });

  afterEach(() => {
    storage.clearAllItems("products");
  });

  test("프로덕트 목록을 반환한다.", (done) => {
    request(app)
      .get("/api/products/")
      .expect(function (res) {
        res.body.products.map(
          (product: ProductType) => (product.id = "fixed id"),
        );
      })
      .expect(
        200,
        {
          products: [
            {
              id: "fixed id",
              name: "피자",
              price: 30000,
              thumbnail: "pizza.png",
            },
            {
              id: "fixed id",
              name: "치킨",
              price: 20000,
              thumbnail: "chicken.png",
            },
          ],
        },
        done,
      );
  });

  test("프로덕트를 추가한다.", (done) => {
    request(app)
      .post("/api/products/")
      .send({ name: "햄버거", price: 8000, thumnail: "hamburger.png" })
      .set("Accept", "application/json")
      .expect(function (res) {
        res.body.id = "fixed id";
      })
      .expect(201, { id: "fixed id" }, done);
  });

  test("프로덕트를 삭제한다.", (done) => {
    const id = product1.getId();
    request(app).del(`/api/products/${id}/`).expect(204, {}, done);
  });
});

describe("카트 API 테스트", () => {
  const storage = new InMemoryStorage();
  const app = createApp(storage);
  const cart = storage.getItem("cart", "my-cart") as Cart;

  beforeEach(() => {
    cart.updateItem("123", 10);
    cart.updateItem("456", 20);
  });

  test("장바구니 내 아이템목록을 반환한다.", (done) => {
    request(app)
      .get("/api/cart/")
      .expect(
        200,
        {
          items: [
            { product_id: "123", quantity: 10 },
            { product_id: "456", quantity: 20 },
          ],
        },
        done,
      );
  });

  test("장바구니 내 아이템 수량을 수정한다.", (done) => {
    request(app)
      .patch("/api/cart/items/123/")
      .send({ quantity: 40 })
      .set("Accept", "application/json")
      .expect(200, { product_id: "123", quantity: 40 }, done);
  });

  test("장바구니 내 아이템을 삭제한다.", (done) => {
    request(app).delete("/api/cart/items/123").expect(204, {}, done);
  });
});
