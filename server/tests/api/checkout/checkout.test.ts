import request from "supertest";
import app from "../../../src/app.js";
import {
  reset as resetProducts,
  save as saveProduct,
  findAll as findProducts,
} from "../../../src/repositories/products.repository.js";
import { reset as resetCart, saveNewItem } from "../../../src/repositories/cart.repository.js";
import { reset as resetCheckout } from "../../../src/repositories/checkout.repository.js";
import { reset as resetCheckoutItem } from "../../../src/repositories/checkoutItem.repository.js";
import { reset as resetCheckoutCoupon } from "../../../src/repositories/checkoutCoupon.repository.js";
import { reset as resetCoupon } from "../../../src/repositories/coupon.repository.js";
import { CouponModel, ProductModel } from "../../../src/models/index.js";

async function seedCoupons() {
  await CouponModel.bulkCreate([
    {
      id: 1,
      couponCode: "FIXED5000",
      name: "5천원",
      expiredDate: "2099-11-30",
      category: "FIXED",
      amount: 5000,
      minOrderAmount: 100000,
    },
    { id: 2, couponCode: "BOGO", name: "BTGO", expiredDate: "2099-05-30", category: "BTGO" },
    {
      id: 3,
      couponCode: "FREESHIPPING",
      name: "무배",
      expiredDate: "2099-08-31",
      category: "FREESHIPPING",
      minOrderAmount: 50000,
    },
  ]);
}

const productA = { name: "상품 A", stock: 10, imageUrl: "https://placehold.co/80x80", price: 35000 };

describe("checkout API", () => {
  beforeEach(async () => {
    await resetCheckoutCoupon();
    await resetCheckoutItem();
    await resetCheckout();
    await resetCart();
    await resetProducts();
    await resetCoupon();
    await saveProduct(productA);
    const [product] = await findProducts();
    await saveNewItem({ productId: product.id, quantity: 3 });
    await seedCoupons();
  });

  async function createCheckout() {
    const [product] = await findProducts();
    const response = await request(app)
      .post("/checkouts")
      .send({ items: [{ product_id: product.id, quantity: 3 }] });
    return response;
  }

  it("POST /checkouts는 201과 checkout_id를 반환하고 최대혜택 쿠폰을 자동 선택한다.", async () => {
    const response = await createCheckout();
    expect(response.status).toBe(201);
    expect(response.body.checkout_id).toEqual(expect.any(Number));

    const detail = await request(app).get(`/checkouts/${response.body.checkout_id}`);
    // 105,000원 → 무료배송, FIXED(5000)+BTGO(35000) = 40000 할인
    expect(detail.body.checkout_amount).toBe(105000);
    expect(detail.body.coupon_discount).toBe(40000);
    expect(detail.body.shipping_fee).toBe(0);
    expect(detail.body.total_amount).toBe(65000);
    expect(detail.body.coupons.filter((coupon: { is_selected: boolean }) => coupon.is_selected)).toHaveLength(2);
  });

  it("GET discount-preview는 쿠폰 조합 할인액을 계산한다.", async () => {
    const { body } = await createCheckout();
    const preview = await request(app).get(`/checkouts/${body.checkout_id}/coupons/discount-preview?couponIds=2`);
    expect(preview.status).toBe(200);
    expect(preview.body.coupon_discount).toBe(35000);
  });

  it("MAX_COUPON_COUNT 초과 쿠폰 미리보기는 400을 반환한다.", async () => {
    const { body } = await createCheckout();
    const preview = await request(app).get(
      `/checkouts/${body.checkout_id}/coupons/discount-preview?couponIds=1&couponIds=2&couponIds=3`,
    );
    expect(preview.status).toBe(400);
    expect(preview.body.code).toBe("INVALID_COUPON_CONDITION");
  });

  it("POST payment은 재고를 차감하고 checkout을 삭제한다(이후 404).", async () => {
    const { body } = await createCheckout();
    const payment = await request(app)
      .post(`/checkouts/${body.checkout_id}/payment`)
      .send({ remote_area: false, coupons: [1, 2] });

    expect(payment.status).toBe(200);
    expect(payment.body).toEqual({ item_count: 1, total_quantity: 3, total_amount: 65000 });

    const after = await request(app).get(`/checkouts/${body.checkout_id}`);
    expect(after.status).toBe(404);

    const products = await findProducts();
    expect(products[0].stock).toBe(7);
  });

  it("DELETE /checkouts/:id는 임시 주문을 삭제한다.", async () => {
    const { body } = await createCheckout();
    const deleted = await request(app).delete(`/checkouts/${body.checkout_id}`);
    expect(deleted.status).toBe(204);
    expect((await request(app).get(`/checkouts/${body.checkout_id}`)).status).toBe(404);
  });

  it("잘못된 checkoutId는 400을 반환한다.", async () => {
    const response = await request(app).get("/checkouts/abc");
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_CHECKOUT_ID");
  });

  describe("POST /checkouts 검증", () => {
    it("같은 product_id가 중복되면 INVALID_REQUEST_BODY를 반환한다.", async () => {
      const [product] = await findProducts();
      const response = await request(app)
        .post("/checkouts")
        .send({
          items: [
            { product_id: product.id, quantity: 1 },
            { product_id: product.id, quantity: 2 },
          ],
        });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("INVALID_REQUEST_BODY");
    });

    it("장바구니에 없는 상품이면 CART_ITEM_NOT_FOUND를 반환한다.", async () => {
      await saveProduct({ ...productA, name: "장바구니에 없는 상품" });
      const products = await findProducts();
      const notInCart = products[products.length - 1];
      const response = await request(app)
        .post("/checkouts")
        .send({ items: [{ product_id: notInCart.id, quantity: 1 }] });
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("CART_ITEM_NOT_FOUND");
    });

    it("요청 수량이 재고보다 크면 OUT_OF_STOCK을 반환한다.", async () => {
      const [product] = await findProducts();
      const response = await request(app)
        .post("/checkouts")
        .send({ items: [{ product_id: product.id, quantity: productA.stock + 1 }] });
      expect(response.status).toBe(409);
      expect(response.body.code).toBe("OUT_OF_STOCK");
    });

    it("수량이 0이면 INVALID_QUANTITY를 반환한다.", async () => {
      const [product] = await findProducts();
      const response = await request(app)
        .post("/checkouts")
        .send({ items: [{ product_id: product.id, quantity: 0 }] });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("INVALID_QUANTITY");
    });

    it("수량이 100이면 INVALID_QUANTITY를 반환한다.", async () => {
      const [product] = await findProducts();
      const response = await request(app)
        .post("/checkouts")
        .send({ items: [{ product_id: product.id, quantity: 100 }] });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("INVALID_QUANTITY");
    });
  });

  describe("GET /checkouts/:id", () => {
    it("없는 checkout이면 CHECKOUT_NOT_FOUND를 반환한다.", async () => {
      const response = await request(app).get("/checkouts/99999");
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("CHECKOUT_NOT_FOUND");
    });

    it("조건을 만족하지 못하는 쿠폰은 disabled=true, is_selected=false로 표시된다.", async () => {
      // 수량 1 → 35,000원. FIXED(min 100,000)는 조건 미달이라 disabled, 자동 선택에서도 제외된다.
      const single = await request(app)
        .post("/checkouts")
        .send({ items: [{ product_id: (await findProducts())[0].id, quantity: 1 }] });
      const detail = await request(app).get(`/checkouts/${single.body.checkout_id}`);
      const fixed = detail.body.coupons.find((coupon: { coupon_id: number }) => coupon.coupon_id === 1);
      expect(fixed.disabled).toBe(true);
      expect(fixed.is_selected).toBe(false);
    });

    it("선택된 쿠폰이 이후 조건 미달이 되면 GET 시 정리되어 선택 해제된다.", async () => {
      const [product] = await findProducts();
      const { body } = await createCheckout(); // 상품 A x3 = 105,000원
      // FREESHIPPING(min 50,000)을 수동 선택한다.
      await request(app)
        .patch(`/checkouts/${body.checkout_id}/coupons`)
        .send({ coupons: [3] });

      // 이후 상품 가격이 내려가 checkout 금액이 50,000원 미만이 되면 FREESHIPPING은 조건 미달이 된다.
      await ProductModel.update({ price: 10000 }, { where: { id: product.id } }); // 30,000원

      const detail = await request(app).get(`/checkouts/${body.checkout_id}`);
      const freeshipping = detail.body.coupons.find((coupon: { coupon_id: number }) => coupon.coupon_id === 3);
      // GET 시 무효 선택 쿠폰이 정리되어 선택 해제 + 비활성으로 표시된다.
      expect(freeshipping.is_selected).toBe(false);
      expect(freeshipping.disabled).toBe(true);

      // 정리가 DB에도 반영되어, 다시 조회해도 선택되지 않은 상태가 유지된다.
      const reloaded = await request(app).get(`/checkouts/${body.checkout_id}`);
      const reloadedCoupon = reloaded.body.coupons.find((coupon: { coupon_id: number }) => coupon.coupon_id === 3);
      expect(reloadedCoupon.is_selected).toBe(false);
    });

    it("remote_area를 반영해 배송비와 총액을 계산한다.", async () => {
      // 수량 1 → 35,000원(무료배송 미달), 도서산간이면 배송비 6,000원
      const single = await request(app)
        .post("/checkouts")
        .send({ items: [{ product_id: (await findProducts())[0].id, quantity: 1 }] });
      await request(app).patch(`/checkouts/${single.body.checkout_id}/address`).send({ remote_area: true });
      const detail = await request(app).get(`/checkouts/${single.body.checkout_id}`);
      expect(detail.body.shipping_fee).toBe(6000);
    });
  });

  describe("PATCH /checkouts/:id/address", () => {
    it("remote_area를 변경하면 204를 반환한다.", async () => {
      const { body } = await createCheckout();
      const response = await request(app).patch(`/checkouts/${body.checkout_id}/address`).send({ remote_area: true });
      expect(response.status).toBe(204);
      const detail = await request(app).get(`/checkouts/${body.checkout_id}`);
      expect(detail.body.remote_area).toBe(true);
    });

    it("없는 checkout이면 CHECKOUT_NOT_FOUND를 반환한다.", async () => {
      const response = await request(app).patch("/checkouts/99999/address").send({ remote_area: true });
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("CHECKOUT_NOT_FOUND");
    });
  });

  describe("PATCH /checkouts/:id/coupons", () => {
    it("쿠폰을 수동 선택하면 204를 반환하고 반영된다.", async () => {
      const { body } = await createCheckout();
      const response = await request(app)
        .patch(`/checkouts/${body.checkout_id}/coupons`)
        .send({ coupons: [2] });
      expect(response.status).toBe(204);
      const detail = await request(app).get(`/checkouts/${body.checkout_id}`);
      const selected = detail.body.coupons.filter((coupon: { is_selected: boolean }) => coupon.is_selected);
      expect(selected.map((coupon: { coupon_id: number }) => coupon.coupon_id)).toEqual([2]);
    });

    it("null이면 전체 해제된다.", async () => {
      const { body } = await createCheckout();
      await request(app).patch(`/checkouts/${body.checkout_id}/coupons`).send({ coupons: null });
      const detail = await request(app).get(`/checkouts/${body.checkout_id}`);
      expect(detail.body.coupons.filter((coupon: { is_selected: boolean }) => coupon.is_selected)).toHaveLength(0);
    });

    it("MAX_COUPON_COUNT 초과면 INVALID_COUPON_CONDITION을 반환한다.", async () => {
      const { body } = await createCheckout();
      const response = await request(app)
        .patch(`/checkouts/${body.checkout_id}/coupons`)
        .send({ coupons: [1, 2, 3] });
      expect(response.status).toBe(400);
      expect(response.body.code).toBe("INVALID_COUPON_CONDITION");
    });

    it("존재하지 않는 쿠폰이면 COUPON_NOT_FOUND를 반환한다.", async () => {
      const { body } = await createCheckout();
      const response = await request(app)
        .patch(`/checkouts/${body.checkout_id}/coupons`)
        .send({ coupons: [9999] });
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("COUPON_NOT_FOUND");
    });
  });

  describe("GET discount-preview", () => {
    it("couponIds가 없으면 coupon_discount 0을 반환한다.", async () => {
      const { body } = await createCheckout();
      const response = await request(app).get(`/checkouts/${body.checkout_id}/coupons/discount-preview`);
      expect(response.status).toBe(200);
      expect(response.body.coupon_discount).toBe(0);
    });

    it("존재하지 않는 쿠폰이면 COUPON_NOT_FOUND를 반환한다.", async () => {
      const { body } = await createCheckout();
      const response = await request(app).get(`/checkouts/${body.checkout_id}/coupons/discount-preview?couponIds=9999`);
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("COUPON_NOT_FOUND");
    });
  });

  describe("POST payment", () => {
    it("재고가 부족하면 OUT_OF_STOCK을 반환하고 롤백되어 재고가 차감되지 않는다.", async () => {
      const [product] = await findProducts();
      const { body } = await createCheckout(); // 수량 3
      // 결제 직전 재고를 2로 떨어뜨린다(다른 경로로 재고가 줄어든 상황 시뮬레이션).
      await ProductModel.update({ stock: 2 }, { where: { id: product.id } });

      const payment = await request(app)
        .post(`/checkouts/${body.checkout_id}/payment`)
        .send({ remote_area: false, coupons: [] });

      expect(payment.status).toBe(409);
      expect(payment.body.code).toBe("OUT_OF_STOCK");

      // 롤백되어 재고는 그대로 2, checkout도 살아 있어야 한다.
      const reloaded = await ProductModel.findByPk(product.id);
      expect(reloaded?.stock).toBe(2);
      expect((await request(app).get(`/checkouts/${body.checkout_id}`)).status).toBe(200);
    });

    it("결제 시 장바구니에서 해당 상품이 제거된다.", async () => {
      const { body } = await createCheckout();
      await request(app).post(`/checkouts/${body.checkout_id}/payment`).send({ remote_area: false, coupons: [] });
      const cart = await request(app).get("/cart");
      expect(cart.body.data).toHaveLength(0);
    });

    it("없는 checkout이면 CHECKOUT_NOT_FOUND를 반환한다.", async () => {
      const response = await request(app).post("/checkouts/99999/payment").send({ remote_area: false, coupons: [] });
      expect(response.status).toBe(404);
      expect(response.body.code).toBe("CHECKOUT_NOT_FOUND");
    });
  });
});
