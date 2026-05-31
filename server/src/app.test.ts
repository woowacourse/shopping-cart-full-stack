import request from "supertest";

import app from "./app.ts";

describe("common error middleware 테스트", () => {
  it("엔드포인트에 해당하는 라우터가 없는 경우 404 ROUTE_NOT_FOUND를 반환한다.", async () => {
    const response = await request(app).get("/unknown");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 404,
      errorCode: "ROUTE_NOT_FOUND",
      errorMessage: "엔드포인트에 해당하는 라우터가 없습니다.",
    });
  });

  it("엔드포인트에 대한 method에 해당하는 라우터가 없는 경우 405 METHOD_NOT_ALLOWED를 반환한다.", async () => {
    const response = await request(app).delete("/products");

    expect(response.status).toBe(405);
    expect(response.body).toEqual({
      status: 405,
      errorCode: "METHOD_NOT_ALLOWED",
      errorMessage: "요청 method에 해당하는 라우터가 없습니다.",
    });
  });

  it("요청 body가 json이 아닌 경우 400 NO_JSON을 반환한다.", async () => {
    const response = await request(app)
      .post("/products")
      .set("Content-Type", "text/plain")
      .send("not json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      errorCode: "NO_JSON",
      errorMessage: "요청 body가 JSON 형태가 아닙니다.",
    });
  });
});
