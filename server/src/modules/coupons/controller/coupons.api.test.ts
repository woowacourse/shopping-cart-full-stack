import request from "supertest";
import app from "@/app";
import { ordersRepository } from "@modules/orders/orders.module";
import { productsRepository } from "@modules/products/products.module";
import { cartsRepository } from "@modules/carts/carts.module";
import type { Product } from "@modules/products/types";

const resetDB = () => {
  productsRepository.clear();
  cartsRepository.clear();
  ordersRepository.clear();
};

const createProductViaApi = async (price: number): Promise<Product> => {
  const res = await request(app)
    .post("/products")
    .send({
      name: `상품-${Math.random().toString(36).slice(2, 8)}`,
      price,
      image: "https://example.com/img.png",
    });
  return res.body.data;
};

const seedOrderWithPrice = async (orderPrice: number) => {
  const product = await createProductViaApi(orderPrice);
  await request(app)
    .post("/order")
    .send({ orderProducts: [{ productId: product.id, quantity: 1 }] });
};

type CouponListItem = {
  couponId: string;
  couponName: string;
  isDisabled: boolean;
  couponExpiration: number;
  option?: string;
};

const getCoupon = (couponList: CouponListItem[], couponId: string) =>
  couponList.find((coupon) => coupon.couponId === couponId);

beforeEach(() => {
  resetDB();
});

describe("GET /coupons (쿠폰 목록 조회)", () => {
  it("쿠폰 목록을 200으로 조회한다", async () => {
    const res = await request(app).get("/coupons");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("쿠폰 목록을 정상적으로 조회하였습니다.");
    expect(Array.isArray(res.body.data.couponList)).toBe(true);
  });

  it("각 쿠폰은 couponId, couponName, isDisabled, couponExpiration을 포함한다", async () => {
    const res = await request(app).get("/coupons");

    expect(res.body.data.couponList[0]).toEqual(
      expect.objectContaining({
        couponId: expect.any(String),
        couponName: expect.any(String),
        // couponDB에는 없지만 BE에서 계산해 내려주는 값
        isDisabled: expect.any(Boolean),
        couponExpiration: expect.any(Number),
      }),
    );
  });
});

describe("GET /coupons - 현재 주문 금액 기반 사용 가능 여부", () => {
  it("주문 금액이 최소주문금액에 미달하면 해당 쿠폰을 isDisabled=true로 내려준다", async () => {
    await seedOrderWithPrice(30000); // FIXED5000(10만), FREESHIPPING(5만) 모두 미달

    const res = await request(app).get("/coupons");
    const couponList = res.body.data.couponList;

    expect(getCoupon(couponList, "FIXED5000")?.isDisabled).toBe(true);
    expect(getCoupon(couponList, "FREESHIPPING")?.isDisabled).toBe(true);
    // 최소주문금액이 0인 쿠폰은 금액 조건의 영향을 받지 않는다.
    expect(getCoupon(couponList, "BOGO")?.isDisabled).toBe(false);
  });

  it("주문 금액이 최소주문금액을 충족하면 isDisabled=false로 내려준다", async () => {
    await seedOrderWithPrice(100000); // FIXED5000, FREESHIPPING 모두 충족

    const res = await request(app).get("/coupons");
    const couponList = res.body.data.couponList;

    expect(getCoupon(couponList, "FIXED5000")?.isDisabled).toBe(false);
    expect(getCoupon(couponList, "FREESHIPPING")?.isDisabled).toBe(false);
  });
});
