import { createApp } from "../app.js";
import InMemoryStorage from "../storages/InMemoryStorage.js";
import StorageHandler from "../StorageHandler.js";
import Product from "../models/Product.js";
import request from "supertest";
import { ProductType } from "../models/Product.js";

describe("프로덕트 API 테스트", () => {
  const storageHandler = new StorageHandler(new InMemoryStorage());
  const app = createApp<InMemoryStorage>(storageHandler);
  const product1 = new Product("피자", 30000, "pizza.png");
  const product2 = new Product("치킨", 20000, "chicken.png");

  beforeEach(() => {
    storageHandler.addItem("products", product1.getId(), product1);
    storageHandler.addItem("products", product2.getId(), product2);
  });

  afterEach(() => {
    storageHandler.clearAllItems("products");
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
