import { AppError } from "../../errors/AppError.js";
import { sequelize } from "../../db/sequelize.js";
import * as checkoutRepository from "../../repositories/checkout.repository.js";
import * as checkoutCouponRepository from "../../repositories/checkoutCoupon.repository.js";
import {
  CreateCheckoutDto,
  UpdateCheckoutAddressDto,
  UpdateCheckoutCouponsDto,
  CouponDiscountPreviewQuery,
  PayCheckoutDto,
  CheckoutDetailResponse,
  PaymentResultResponse,
} from "../../interfaces/checkout.interface.js";
import {
  findCheckoutOrThrow,
  clearCheckout,
  isEmptyCoupons,
  hasDuplicateProductId,
  assertCreatable,
  persistCheckoutItems,
  assignBestCoupons,
  computeCheckout,
  pruneInvalidSelections,
  buildCheckoutDetail,
  validateSelectableCoupons,
  previewDiscount,
  runPayment,
} from "./internal.js";

export const CHECKOUT_TTL_HOURS = 1;

export async function createCheckout(dto: CreateCheckoutDto): Promise<{ checkout_id: number }> {
  if (hasDuplicateProductId(dto.items)) {
    throw new AppError("INVALID_REQUEST_BODY", 400);
  }
  await Promise.all(dto.items.map(assertCreatable));

  const checkout = await checkoutRepository.create({ remoteArea: false });
  await persistCheckoutItems(checkout.id, dto.items);
  await assignBestCoupons(checkout.id);

  return { checkout_id: checkout.id };
}

export async function getCheckout(checkoutId: number): Promise<CheckoutDetailResponse> {
  const computation = await computeCheckout(checkoutId);
  const validIds = await pruneInvalidSelections(computation);
  return buildCheckoutDetail(computation, validIds);
}

export async function deleteCheckout(checkoutId: number): Promise<void> {
  await findCheckoutOrThrow(checkoutId);
  await clearCheckout(checkoutId);
}

export async function updateCheckoutAddress(checkoutId: number, dto: UpdateCheckoutAddressDto): Promise<void> {
  await findCheckoutOrThrow(checkoutId);
  await checkoutRepository.updateRemoteArea(checkoutId, { remoteArea: dto.remote_area });
}

export async function updateCheckoutCoupons(checkoutId: number, dto: UpdateCheckoutCouponsDto): Promise<void> {
  await findCheckoutOrThrow(checkoutId);
  if (isEmptyCoupons(dto.coupons)) {
    await checkoutCouponRepository.deleteByCheckoutId(checkoutId);
    return;
  }
  await validateSelectableCoupons(checkoutId, dto.coupons);
  await checkoutCouponRepository.replaceByCheckoutId(checkoutId, { couponIds: dto.coupons });
}

export async function getCouponDiscountPreview(
  checkoutId: number,
  query: CouponDiscountPreviewQuery,
): Promise<{ coupon_discount: number }> {
  const checkout = await findCheckoutOrThrow(checkoutId);
  return { coupon_discount: await previewDiscount(checkout, query.couponIds ?? []) };
}

export async function payCheckout(checkoutId: number, dto: PayCheckoutDto): Promise<PaymentResultResponse> {
  await findCheckoutOrThrow(checkoutId);
  return sequelize.transaction((transaction) => runPayment(checkoutId, { dto, transaction }));
}

export async function deleteExpiredCheckouts(): Promise<void> {
  const expiredAt = Date.now() - CHECKOUT_TTL_HOURS * 60 * 60 * 1000;
  const ids = await checkoutRepository.findIdsOlderThan(expiredAt);
  await Promise.all(ids.map((id) => deleteExpiredCheckout(id)));
}

async function deleteExpiredCheckout(checkoutId: number): Promise<void> {
  await sequelize.transaction(async (transaction) => {
    // 삭제 직전 존재 여부 재확인 (cleanup과 결제가 동시에 도는 경우 방어)
    if (!(await checkoutRepository.findById(checkoutId, { transaction }))) {
      return;
    }
    await clearCheckout(checkoutId, transaction);
  });
}
