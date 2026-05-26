import request from "supertest";

import app from "../../app.js";

describe("GET /products", () => {
  it("returns product list", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 200,
      data: [
        {
          id: "1",
          price: 18000,
          name: "Shopping Basket",
          imgUrl: "https://example.com/images/shopping-basket.png",
        },
        {
          id: "2",
          price: 32000,
          name: "Tote Bag",
          imgUrl: "https://example.com/images/tote-bag.png",
        },
        {
          id: "3",
          price: 9900,
          name: "Reusable Cup",
          imgUrl: "https://example.com/images/reusable-cup.png",
        },
      ],
    });
  });
});
