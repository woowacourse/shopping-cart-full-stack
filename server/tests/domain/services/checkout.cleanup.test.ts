import { deleteExpiredCheckouts, CHECKOUT_TTL_HOURS } from "../../../src/services/checkout/index.js";
import {
  CheckoutModel,
  CheckoutItemModel,
  CheckoutCouponModel,
  ProductModel,
  CouponModel,
} from "../../../src/models/index.js";
import { sequelize } from "../../../src/db/sequelize.js";

const HOUR_MS = 60 * 60 * 1000;

async function truncateAll() {
  await sequelize.query(
    'TRUNCATE TABLE "checkout_coupons","checkout_items","checkouts","products","coupons" RESTART IDENTITY CASCADE',
  );
}

describe("checkout.service cleanup", () => {
  beforeEach(async () => {
    await truncateAll();
    await ProductModel.create({ id: 1, name: "상품", stock: 10, imageUrl: "x", price: 1000 });
    await CouponModel.create({
      id: 1,
      couponCode: "C",
      name: "쿠폰",
      expiredDate: "2099-12-31",
      category: "FIXED",
      amount: 1000,
    });
  });

  async function createCheckoutAt(createdAt: Date): Promise<number> {
    const checkout = await CheckoutModel.create({ remoteArea: false, createdAt });
    await CheckoutItemModel.create({ checkoutId: checkout.id, productId: 1, quantity: 1 });
    await CheckoutCouponModel.create({ checkoutId: checkout.id, couponId: 1 });
    return checkout.id;
  }

  it("TTL보다 오래된 checkout과 자식 행을 모두 삭제한다.", async () => {
    const oldId = await createCheckoutAt(new Date(Date.now() - (CHECKOUT_TTL_HOURS + 1) * HOUR_MS));

    await deleteExpiredCheckouts();

    expect(await CheckoutModel.findByPk(oldId)).toBeNull();
    expect(await CheckoutItemModel.count({ where: { checkoutId: oldId } })).toBe(0);
    expect(await CheckoutCouponModel.count({ where: { checkoutId: oldId } })).toBe(0);
  });

  it("TTL 이내의 최근 checkout은 삭제하지 않는다.", async () => {
    const recentId = await createCheckoutAt(new Date());

    await deleteExpiredCheckouts();

    expect(await CheckoutModel.findByPk(recentId)).not.toBeNull();
  });

  it("만료된 것만 삭제하고 최근 것은 남긴다.", async () => {
    const oldId = await createCheckoutAt(new Date(Date.now() - (CHECKOUT_TTL_HOURS + 1) * HOUR_MS));
    const recentId = await createCheckoutAt(new Date());

    await deleteExpiredCheckouts();

    expect(await CheckoutModel.findByPk(oldId)).toBeNull();
    expect(await CheckoutModel.findByPk(recentId)).not.toBeNull();
  });
});
