import * as orderCheckRepository from '../repositories/OrderCheckRepository.js';
import * as CouponRepository from '../repositories/CouponRepository.js';
import { BadRequestError, NotFoundError } from '../errors.js';
import { computePayInfo, findOrderOrThrow } from './OrderCheckService.js';

const MAX_SELECTED_COUPON_COUNT = 2;

type CouponSelectionResult = {
    couponIds: string[];
    discountAmount: number;
};

type CouponDiscountSummary = {
    orderDiscountAmount: number;
    shippingDiscountAmount: number;
    totalDiscountAmount: number;
};

const validateSelectedCouponIdsShape = (selectedCouponIds: unknown): string[] => {
    if (selectedCouponIds === undefined) {
        throw new BadRequestError({
            errorCode: 'MISSING_FIELD',
            errorMessage: 'selectedCouponId는 필수입니다.',
            data: [{ type: 'selectedCouponId', errorCode: 'REQUIRED' }],
        });
    }

    if (!Array.isArray(selectedCouponIds) || !selectedCouponIds.every((couponId) => typeof couponId === 'string')) {
        throw new BadRequestError({
            errorCode: 'TYPE_MISSMATCH',
            errorMessage: 'selectedCouponId는 문자열 배열이어야 합니다.',
        });
    }

    return selectedCouponIds;
};

const findCouponOrThrow = async (couponId: string) => {
    const couponInfo = await CouponRepository.getById(couponId);

    if (!couponInfo) {
        throw new NotFoundError({
            errorCode: 'RESOURCE_NOT_FOUND',
            errorMessage: `존재하지 않는 쿠폰입니다: ${couponId}`,
        });
    }

    return couponInfo;
};

const validateSelectedCouponCount = (selectedCouponIds: string[]) => {
    if (selectedCouponIds.length <= MAX_SELECTED_COUPON_COUNT) return;

    throw new BadRequestError({
        errorCode: 'INVALID',
        errorMessage: '쿠폰은 최대 2개까지 선택할 수 있습니다.',
        data: [{ type: 'selectedCouponId', errorCode: 'INVALID_COUPON_COUNT' }],
    });
};

const validateDuplicateCouponSelection = (selectedCouponIds: string[]) => {
    if (new Set(selectedCouponIds).size === selectedCouponIds.length) return;

    throw new BadRequestError({
        errorCode: 'INVALID',
        errorMessage: '같은 쿠폰은 중복 선택할 수 없습니다.',
        data: [{ type: 'selectedCouponId', errorCode: 'DUPLICATED' }],
    });
};

const getCouponApplicationPriority = (coupon: CouponRepository.CouponRecord) => {
    switch (coupon.discountType) {
        case 'FIXED':
        case 'BOGO':
            return 1;
        case 'PERCENTAGE':
            return 2;
        case 'FREE_SHIPPING':
            return 3;
    }
};

const getCouponApplicationOrder = (coupons: CouponRepository.CouponRecord[]) => {
    return [...coupons].sort((left, right) => getCouponApplicationPriority(left) - getCouponApplicationPriority(right));
};

const getFixedCouponDiscountAmount = (
    beforeAmount: number,
    coupon: Extract<CouponRepository.CouponRecord, { discountType: 'FIXED' }>
) => {
    return Math.min(beforeAmount, coupon.discountValue);
};

const getBogoCouponDiscountAmount = (
    order: Awaited<ReturnType<typeof findOrderOrThrow>>,
    coupon: Extract<CouponRepository.CouponRecord, { discountType: 'BOGO' }>
) => {
    const minimumRequiredQuantity = coupon.minQuantityPerProduct + coupon.getPerProduct;
    const eligibleProducts = order.products.filter((product) => product.quantity >= minimumRequiredQuantity);

    if (eligibleProducts.length === 0) {
        return 0;
    }

    const highestPrice = Math.max(...eligibleProducts.map((product) => product.price));
    return highestPrice * coupon.getPerProduct;
};

const getFreeShippingCouponDiscountAmount = (deliveryFee: number) => {
    return deliveryFee;
};

const getPercentageCouponDiscountAmount = (
    beforeAmount: number,
    coupon: Extract<CouponRepository.CouponRecord, { discountType: 'PERCENTAGE' }>
) => {
    return Math.floor(beforeAmount * coupon.discountValue);
};

const calculateCouponDiscountSummary = (
    order: Awaited<ReturnType<typeof findOrderOrThrow>>,
    coupons: CouponRepository.CouponRecord[]
): CouponDiscountSummary => {
    const payInfo = computePayInfo(order);
    let remainingOrderAmount = payInfo.orderPrice;
    let orderDiscountAmount = 0;
    let shippingDiscountAmount = 0;

    for (const coupon of getCouponApplicationOrder(coupons)) {
        switch (coupon.discountType) {
            case 'FIXED': {
                const couponDiscount = getFixedCouponDiscountAmount(remainingOrderAmount, coupon);
                remainingOrderAmount -= couponDiscount;
                orderDiscountAmount += couponDiscount;
                break;
            }
            case 'BOGO': {
                const couponDiscount = Math.min(remainingOrderAmount, getBogoCouponDiscountAmount(order, coupon));
                remainingOrderAmount -= couponDiscount;
                orderDiscountAmount += couponDiscount;
                break;
            }
            case 'PERCENTAGE': {
                const couponDiscount = getPercentageCouponDiscountAmount(remainingOrderAmount, coupon);
                remainingOrderAmount -= couponDiscount;
                orderDiscountAmount += couponDiscount;
                break;
            }
            case 'FREE_SHIPPING': {
                shippingDiscountAmount = getFreeShippingCouponDiscountAmount(payInfo.deliveryFee);
                break;
            }
        }
    }

    return {
        orderDiscountAmount,
        shippingDiscountAmount,
        totalDiscountAmount: orderDiscountAmount + shippingDiscountAmount,
    };
};

const buildCouponSelections = (coupons: CouponRepository.CouponRecord[]) => {
    const selections: CouponRepository.CouponRecord[][] = [[]];

    for (let first = 0; first < coupons.length; first += 1) {
        selections.push([coupons[first]]);

        for (let second = first + 1; second < coupons.length; second += 1) {
            selections.push([coupons[first], coupons[second]]);
        }
    }

    return selections;
};

const isBetterSelection = (candidate: CouponSelectionResult, currentBest: CouponSelectionResult) => {
    if (candidate.discountAmount !== currentBest.discountAmount) {
        return candidate.discountAmount > currentBest.discountAmount;
    }

    if (candidate.couponIds.length !== currentBest.couponIds.length) {
        return candidate.couponIds.length < currentBest.couponIds.length;
    }

    return candidate.couponIds.join(',') < currentBest.couponIds.join(',');
};

const isValidateDate = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    expiry.setHours(23, 59, 59, 999);

    return new Date() <= expiry;
};

const isValidateMinOrderAmount = async (minOrderAmount: number, userId: string) => {
    const orderCheckInfo = await orderCheckRepository.getOrder(userId);
    const orderPrice = computePayInfo(orderCheckInfo).orderPrice;

    return orderPrice >= minOrderAmount;
};

const isValidateBogoType = async (userId: string, minQuantityPerProduct: number, getPerProduct: number) => {
    const orderCheckInfo = await orderCheckRepository.getOrder(userId);
    const minimumRequiredQuantity = minQuantityPerProduct + getPerProduct;

    return orderCheckInfo?.products.some((product) => product.quantity >= minimumRequiredQuantity) ?? false;
};

const isValidateTime = (from: Date, to: Date): boolean => {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const fromMin = from.getHours() * 60 + from.getMinutes();
    const toMin = to.getHours() * 60 + to.getMinutes();

    return fromMin <= current && current < toMin;
};

const parseTime = (timeStr: string): Date => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
};

const isCouponValid = async (coupon: CouponRepository.CouponRecord, userId: string) => {
    if (!isValidateDate(coupon.expiresAt)) return false;
    if (!(await isValidateMinOrderAmount(coupon.minOrderAmount, userId))) return false;

    if (coupon.discountType === 'PERCENTAGE' && coupon.usableTime) {
        if (!isValidateTime(parseTime(coupon.usableTime.from), parseTime(coupon.usableTime.to))) {
            return false;
        }
    }

    if (coupon.discountType === 'BOGO') {
        if (!(await isValidateBogoType(userId, coupon.minQuantityPerProduct, coupon.getPerProduct))) {
            return false;
        }
    }

    return true;
};

const getSelectedCouponsOrThrow = async (selectedCouponIds: string[], userId: string) => {
    validateSelectedCouponCount(selectedCouponIds);
    validateDuplicateCouponSelection(selectedCouponIds);

    const coupons = await Promise.all(selectedCouponIds.map((couponId) => findCouponOrThrow(couponId)));
    const isValidResults = await Promise.all(coupons.map((coupon) => isCouponValid(coupon, userId)));
    const invalidCoupon = coupons.find((_, index) => !isValidResults[index]);

    if (invalidCoupon) {
        throw new BadRequestError({
            errorCode: 'INVALID',
            errorMessage: `현재 주문에는 사용할 수 없는 쿠폰입니다: ${invalidCoupon.couponId}`,
            data: [{ type: 'selectedCouponId', errorCode: 'INVALID' }],
        });
    }

    return coupons;
};

export const getOrderCheckCoupons = async (userId: string) => {
    await findOrderOrThrow(userId);

    const coupons = await CouponRepository.getAll();
    const validCoupons = await getValidateCoupons(coupons, userId);
    const validCouponIds = new Set(validCoupons.map((coupon) => coupon.couponId));
    const selectedCoupons = await CouponRepository.getSelectedCouponIds(userId);
    const bestCouponSelection = await getBestDiscountCouponCombination(userId);

    return {
        coupons: coupons.map((coupon) => ({
            couponId: coupon.couponId,
            couponTitle: coupon.couponTitle,
            disabled: !validCouponIds.has(coupon.couponId),
            description: coupon.description,
        })),
        selectedCoupons: selectedCoupons.length > 0 ? selectedCoupons : bestCouponSelection.couponIds,
    };
};

export const getDisCountAmount = async (selectedCouponIds: unknown, userId: string) => {
    const order = await findOrderOrThrow(userId);
    const couponIds = validateSelectedCouponIdsShape(selectedCouponIds);
    const coupons = await getSelectedCouponsOrThrow(couponIds, userId);

    return calculateCouponDiscountSummary(order, coupons).totalDiscountAmount;
};

export const getBestDiscountCouponCombination = async (userId: string) => {
    const order = await findOrderOrThrow(userId);
    const coupons = await CouponRepository.getAll();
    const validCoupons = await getValidateCoupons(coupons, userId);

    return buildCouponSelections(validCoupons).reduce<CouponSelectionResult>(
        (best, selection) => {
            const candidate = {
                couponIds: selection.map((coupon) => coupon.couponId),
                discountAmount: calculateCouponDiscountSummary(order, selection).totalDiscountAmount,
            };

            return isBetterSelection(candidate, best) ? candidate : best;
        },
        { couponIds: [], discountAmount: 0 }
    );
};

export const selectCoupon = async (selectedCouponIds: unknown, userId: string) => {
    await findOrderOrThrow(userId);
    const couponIds = validateSelectedCouponIdsShape(selectedCouponIds);
    await getSelectedCouponsOrThrow(couponIds, userId);

    return CouponRepository.setSelectedCouponIds(userId, couponIds);
};

export const getSelectedCouponDiscountAmount = async (userId: string) => {
    const selectedCouponIds = await CouponRepository.getSelectedCouponIds(userId);

    if (selectedCouponIds.length === 0) {
        return 0;
    }

    return getDisCountAmount(selectedCouponIds, userId);
};

export const getSelectedCouponDiscountSummary = async (userId: string) => {
    const selectedCouponIds = await CouponRepository.getSelectedCouponIds(userId);

    if (selectedCouponIds.length === 0) {
        return {
            orderDiscountAmount: 0,
            shippingDiscountAmount: 0,
            totalDiscountAmount: 0,
        };
    }

    const order = await findOrderOrThrow(userId);
    const coupons = await getSelectedCouponsOrThrow(selectedCouponIds, userId);

    return calculateCouponDiscountSummary(order, coupons);
};

export const getValidateCoupons = async (coupons: CouponRepository.CouponRecord[], userId: string) => {
    const results = await Promise.all(coupons.map((coupon) => isCouponValid(coupon, userId)));
    return coupons.filter((_, index) => results[index]);
};
