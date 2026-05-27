import app from "../app.js";
import request from "supertest";
import { ProductType } from "../models/Product.js";

describe("GET /api/products/", () => {
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
              name: "수건",
              price: 10000,
              thumbnail: "/some_image2",
            },
            {
              id: "fixed id",
              name: "양말",
              price: 3000,
              thumbnail: "/some_image1",
            },
          ],
        },
        done,
      );
  });
});
