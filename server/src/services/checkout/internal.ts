import { Transaction } from "sequelize";
import { AppError } from "../../errors/AppError.js";
import * as checkoutRepository from "../../repositories/checkout.repository.js";
import * as checkoutItemRepository from "../../repositories/checkoutItem.repository.js";
import * as checkoutCouponRepository from "../../repositories/checkoutCoupon.repository.js";
import * as couponRepository from "../../repositories/coupon.repository.js";
import * as productRepository from "../../repositories/products.repository.js";
import * as cartRepository from "../../repositories/cart.repository.js";
import { calculateShippingFee } from "../shipping.service.js";
import {
  validateCouponCondition,
  getValidCoupons,
  calculateCouponDiscount,
  findBestCouponCombination,
  sumCheckoutAmount,
} from "../coupon/index.js";
import {
  CreateCheckoutDto,
  PayCheckoutDto,
  CheckoutDetailResponse,
  CheckoutItemResponse,
  PaymentResultResponse,
  PricedItem,
  CheckoutItem,
  Checkout,
} from "../../interfaces/checkout.interface.js";
import { Coupon, CouponResponse } from "../../interfaces/coupon.interface.js";
import { Product } from "../../interfaces/product.interface.js";

export interface PricedItemDetail {
  product: Product;
  quantity: number;
}

// ---- 공통 조회 헬퍼 ----

export async function findCheckoutOrThrow(checkoutId: number): Promise<Checkout> {
  const checkout = await checkoutRepository.findById(checkoutId);
  if (!checkout) {
    throw new AppError("CHECKOUT_NOT_FOUND", 404);
  }
  return checkout;
}

async function findProductOrThrow(productId: number): Promise<Product> {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError("PRODUCT_NOT_FOUND", 404);
  }
  return product;
}

/** CHECKOUT_ITEM에 현재 PRODUCT_DB 정보를 합친다. 상품이 없으면 PRODUCT_NOT_FOUND. */
async function toPricedItemDetails(items: CheckoutItem[]): Promise<PricedItemDetail[]> {
  return Promise.all(
    items.map(async (item) => ({ product: await findProductOrThrow(item.productId), quantity: item.quantity })),
  );
}

function toPriced(details: PricedItemDetail[]): PricedItem[] {
  return details.map(({ product, quantity }) => ({ productId: product.id, price: product.price, quantity }));
}

/** 쿠폰 조건 검증에 필요한 맥락(할인 전 금액 / 항목 / 현재 시각)을 만든다. */
function couponContextOf(priced: PricedItem[]) {
  return { checkoutAmount: sumCheckoutAmount(priced), items: priced, now: new Date() };
}

async function loadDetails(checkoutId: number): Promise<PricedItemDetail[]> {
  return toPricedItemDetails(await checkoutItemRepository.findAllByCheckoutId(checkoutId));
}

/** checkout과 그 자식(쿠폰/항목) rows를 함께 삭제한다. 결제/취소/정리에서 공유한다. */
export async function clearCheckout(checkoutId: number, transaction?: Transaction): Promise<void> {
  await checkoutCouponRepository.deleteByCheckoutId(checkoutId, { transaction });
  await checkoutItemRepository.deleteByCheckoutId(checkoutId, { transaction });
  await checkoutRepository.deleteById(checkoutId, { transaction });
}

/** coupons가 null이거나 빈 배열이면 "쿠폰 전체 해제" 의도로 본다. */
export function isEmptyCoupons(coupons: number[] | null): coupons is null | [] {
  return coupons === null || coupons.length === 0;
}

// ---- createCheckout ----

export function hasDuplicateProductId(items: CreateCheckoutDto["items"]): boolean {
  const productIds = items.map((item) => item.product_id);
  return new Set(productIds).size !== productIds.length;
}

/** 주문 항목으로 담을 수 있는지 검증한다: 장바구니에 있는 상품인지 + 재고가 충분한지. */
export async function assertCreatable(item: CreateCheckoutDto["items"][number]): Promise<void> {
  const cartItems = await cartRepository.findAll();
  if (!cartItems.some((cartItem) => cartItem.productId === item.product_id)) {
    throw new AppError("CART_ITEM_NOT_FOUND", 404);
  }
  if (item.quantity > (await findProductOrThrow(item.product_id)).stock) {
    throw new AppError("OUT_OF_STOCK", 409);
  }
}

export async function persistCheckoutItems(checkoutId: number, items: CreateCheckoutDto["items"]): Promise<void> {
  await checkoutItemRepository.bulkCreate(checkoutId, {
    items: items.map((item) => ({ productId: item.product_id, quantity: item.quantity })),
  });
}

/** 생성 직후 최대혜택 쿠폰 조합을 계산해 자동 선택한다(remote_area=false 기준). */
export async function assignBestCoupons(checkoutId: number): Promise<void> {
  const priced = toPriced(await loadDetails(checkoutId));
  const shippingFee = calculateShippingFee(sumCheckoutAmount(priced), false);
  const context = { items: priced, shippingFee, now: new Date() };
  const bestIds = findBestCouponCombination(await couponRepository.findAll(), context);
  await checkoutCouponRepository.replaceByCheckoutId(checkoutId, { couponIds: bestIds });
}

// ---- getCheckout (조회 view model) ----

interface CouponViewContext {
  selectedIds: number[];
  checkoutAmount: number;
  items: PricedItem[];
  now: Date;
}

function toCouponConditionView(coupon: Coupon) {
  return {
    minOrderAmount: coupon.minOrderAmount,
    usableStartAt: coupon.usableStartAt,
    usableEndAt: coupon.usableEndAt,
  };
}

function toCouponResponse(coupon: Coupon, context: CouponViewContext): CouponResponse {
  return {
    couponId: coupon.id,
    name: coupon.name,
    expiredDate: coupon.expiredDate,
    ...toCouponConditionView(coupon),
    isSelected: context.selectedIds.includes(coupon.id),
    disabled: !validateCouponCondition(coupon, context),
  };
}

function toCheckoutItemResponses(details: PricedItemDetail[]): CheckoutItemResponse[] {
  return details.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity,
  }));
}

interface CheckoutComputation {
  checkout: Checkout;
  details: PricedItemDetail[];
  priced: PricedItem[];
  coupons: Coupon[];
  checkoutAmount: number;
  items: PricedItem[];
  now: Date;
}

/** 조회/응답 계산에 필요한 데이터(checkout, 항목, 쿠폰, 금액 맥락)를 한 번에 모은다. */
export async function computeCheckout(checkoutId: number): Promise<CheckoutComputation> {
  const checkout = await findCheckoutOrThrow(checkoutId);
  const details = await loadDetails(checkoutId);
  const priced = toPriced(details);
  const coupons = await couponRepository.findAll();
  return { checkout, details, priced, coupons, ...couponContextOf(priced) };
}

function selectValidIds(computation: CheckoutComputation, selectedIds: number[]): number[] {
  return selectedIds.filter((id) => {
    const coupon = computation.coupons.find((candidate) => candidate.id === id);
    return coupon !== undefined && validateCouponCondition(coupon, computation);
  });
}

/** GET 요청이지만 프론트 선택 상태 일관성을 위해 무효 선택 쿠폰을 정리하고, 남은 선택 id를 반환한다. */
export async function pruneInvalidSelections(computation: CheckoutComputation): Promise<number[]> {
  const rows = await checkoutCouponRepository.findAllByCheckoutId(computation.checkout.id);
  const selectedIds = rows.map((row) => row.couponId);
  const validIds = selectValidIds(computation, selectedIds);
  if (validIds.length !== selectedIds.length) {
    await checkoutCouponRepository.replaceByCheckoutId(computation.checkout.id, { couponIds: validIds });
  }
  return validIds;
}

interface Amounts {
  checkoutAmount: number;
  couponDiscount: number;
  shippingFee: number;
}

function buildAmounts({ checkoutAmount, couponDiscount, shippingFee }: Amounts) {
  return { checkoutAmount, couponDiscount, shippingFee, totalAmount: checkoutAmount - couponDiscount + shippingFee };
}

function computeAmounts(computation: CheckoutComputation, validIds: number[]) {
  const { checkout, priced, checkoutAmount, coupons } = computation;
  const selectedCoupons = coupons.filter((coupon) => validIds.includes(coupon.id));
  const shippingFee = calculateShippingFee(checkoutAmount, checkout.remoteArea);
  const couponDiscount = calculateCouponDiscount(selectedCoupons, { items: priced, shippingFee });
  return buildAmounts({ checkoutAmount, couponDiscount, shippingFee });
}

function buildCoupons(computation: CheckoutComputation, validIds: number[]): CouponResponse[] {
  const couponContext = {
    selectedIds: validIds,
    checkoutAmount: computation.checkoutAmount,
    items: computation.items,
    now: computation.now,
  };
  return computation.coupons.map((coupon) => toCouponResponse(coupon, couponContext));
}

export function buildCheckoutDetail(computation: CheckoutComputation, validIds: number[]): CheckoutDetailResponse {
  return {
    checkoutId: computation.checkout.id,
    items: toCheckoutItemResponses(computation.details),
    coupons: buildCoupons(computation, validIds),
    remoteArea: computation.checkout.remoteArea,
    ...computeAmounts(computation, validIds),
  };
}

// ---- updateCheckoutCoupons / preview ----

/** 현재 checkout 금액 기준으로 선택하려는 쿠폰들이 유효한지 검증한다(실패 시 throw). */
export async function validateSelectableCoupons(checkoutId: number, couponIds: number[]): Promise<void> {
  const priced = toPriced(await loadDetails(checkoutId));
  await getValidCoupons(couponIds, couponContextOf(priced));
}

export async function previewDiscount(checkout: Checkout, couponIds: number[]): Promise<number> {
  if (couponIds.length === 0) {
    return 0;
  }
  const priced = toPriced(await loadDetails(checkout.id));
  const shippingFee = calculateShippingFee(sumCheckoutAmount(priced), checkout.remoteArea);
  const coupons = await getValidCoupons(couponIds, couponContextOf(priced));
  return calculateCouponDiscount(coupons, { items: priced, shippingFee });
}

// ---- payCheckout / cleanup ----

interface PaymentComputation {
  items: CheckoutItem[];
  details: PricedItemDetail[];
  priced: PricedItem[];
  checkoutAmount: number;
  shippingFee: number;
}

async function computePayment(checkoutId: number, remoteArea: boolean): Promise<PaymentComputation> {
  const items = await checkoutItemRepository.findAllByCheckoutId(checkoutId);
  const details = await toPricedItemDetails(items);
  const priced = toPriced(details);
  const checkoutAmount = sumCheckoutAmount(priced);
  const shippingFee = calculateShippingFee(checkoutAmount, remoteArea);
  return { items, details, priced, checkoutAmount, shippingFee };
}

function assertAllInStock(details: PricedItemDetail[]): void {
  const outOfStock = details.some(({ product, quantity }) => quantity > product.stock);
  if (outOfStock) {
    throw new AppError("OUT_OF_STOCK", 409);
  }
}

async function resolvePaymentCoupons(coupons: number[] | null, computation: PaymentComputation): Promise<Coupon[]> {
  if (isEmptyCoupons(coupons)) {
    return [];
  }
  const context = { checkoutAmount: computation.checkoutAmount, items: computation.priced, now: new Date() };
  return getValidCoupons(coupons, context);
}

async function deductStockAndCart(details: PricedItemDetail[], transaction: Transaction): Promise<void> {
  await Promise.all(
    details.map(async ({ product, quantity }) => {
      await productRepository.decreaseStock(product.id, { quantity, transaction });
      await cartRepository.deleteByProductId(product.id, { transaction });
    }),
  );
}

function toPaymentResult(items: CheckoutItem[], totalAmount: number): PaymentResultResponse {
  return {
    itemCount: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount,
  };
}

function paymentTotal(computation: PaymentComputation, coupons: Coupon[]): number {
  const couponDiscount = calculateCouponDiscount(coupons, {
    items: computation.priced,
    shippingFee: computation.shippingFee,
  });
  return computation.checkoutAmount - couponDiscount + computation.shippingFee;
}

interface PaymentCommit {
  checkoutId: number;
  remoteArea: boolean;
  details: PricedItemDetail[];
  transaction: Transaction;
}

/** 검증 통과 후 상태 변경: 배송지 반영, 재고 차감, 장바구니 정리, checkout 삭제. */
async function commitPayment(commit: PaymentCommit): Promise<void> {
  const { checkoutId, remoteArea, details, transaction } = commit;
  await checkoutRepository.updateRemoteArea(checkoutId, { remoteArea, transaction });
  await deductStockAndCart(details, transaction);
  await clearCheckout(checkoutId, transaction);
}

export interface PaymentContext {
  dto: PayCheckoutDto;
  transaction: Transaction;
}

/** 결제 트랜잭션 본문: 검증(쿠폰+재고) 후 재고 차감·장바구니 정리·checkout 삭제까지 원자적으로 처리한다. */
export async function runPayment(checkoutId: number, context: PaymentContext): Promise<PaymentResultResponse> {
  const { dto, transaction } = context;
  const computation = await computePayment(checkoutId, dto.remote_area);
  const coupons = await resolvePaymentCoupons(dto.coupons, computation);
  assertAllInStock(computation.details);

  await commitPayment({ checkoutId, remoteArea: dto.remote_area, details: computation.details, transaction });
  return toPaymentResult(computation.items, paymentTotal(computation, coupons));
}
