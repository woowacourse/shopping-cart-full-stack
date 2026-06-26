import type {
  OrderSheetResponse,
  CreateOrderSheetResponse,
} from "./orderSheets.dto.ts";

import * as orderSheetStore from "./orderSheets.repository.ts";
import * as productsStore from "../products/products.repository.ts";
import * as cartsStore from "../carts/carts.repository.ts";
import * as couponsStore from "../coupons/coupons.repository.ts";

import {
  calculateOrderSheetAmount,
  calculateAppliedShippingFee,
  calculateCouponDiscountAmount,
  calculatePaymentAmount,
  calculateBestCouponCombination,
  canUseCoupon,
} from "./orderSheets.domain.ts";
import type {
  CanUseCoupon,
  CanUseCouponContext,
} from "./orderSheets.domain.ts";

export const getOrderSheetById = (orderSheetId: number): OrderSheetResponse => {
  const orderSheet = orderSheetStore.findById(orderSheetId);
  if (!orderSheet) throw new Error();

  return {
    orderSheet: {
      items: orderSheet.products.map((product) => {
        const productData = productsStore.findById(product.id);
        if (!productData) throw new Error();

        return {
          product: {
            id: product.id,
            name: productData.name,
            price: productData.price,
            imgUrl: productData.imgUrl,
          },
          quantity: product.quantity,
        };
      }),
      isRemoteShippingArea: orderSheet.isRemoteShippingArea,
      selectedCoupons: orderSheet.selectedCoupons,
    },
  };
};

export const createOrderSheet = (
  cartId: number,
  productIds: number[],
): CreateOrderSheetResponse => {
  const allCoupons = couponsStore.findAll();
  const cart = cartsStore.findById(cartId);
  if (!cart) throw new Error();

  const products = productIds.map((id) => {
    const cartsProducts = cart.products;
    const product = cartsProducts.find((cartProduct) => cartProduct.id === id);
    if (!product) throw new Error();

    return {
      id: product.id,
      quantity: product.quantity,
    };
  });

  const orderSheetAmount = calculateOrderSheetAmount(
    products.map((product) => {
      const productData = productsStore.findById(product.id);
      if (!productData) throw new Error();
      return {
        quantity: product.quantity,
        price: productData.price,
      };
    }),
  );

  const ableCoupons = allCoupons
    .filter((coupon) => {
      return canUseCoupon(
        coupon as CanUseCoupon,
        {
          orderSheetAmount,
          products,
          now: new Date(),
        } as CanUseCouponContext,
      );
    })
    .map((coupon) => coupon.code);

  const productsData = products
    .map((product) => {
      const productData = productsStore.findById(product.id);
      if (!productData) throw new Error();
      return { price: productData.price, quantity: product.quantity };
    })
    .filter(Boolean);

  const bestCouponCodes = calculateBestCouponCombination(
    productsData,
    ableCoupons,
    3000,
  );

  const bestCouponIds = bestCouponCodes.map((couponCode) => {
    const coupon = allCoupons.find((coupon) => coupon.code === couponCode);
    if (!coupon) throw new Error();
    return coupon.id;
  });

  const orderSheet = {
    products,
    remoteArea: false,
    coupons: bestCouponIds,
  };

  const newOrderSheet = orderSheetStore.create(orderSheet);
  return newOrderSheet;
};

export const getOrderSheetPricing = (orderSheetId: number) => {
  const { orderSheet } = getOrderSheetById(orderSheetId);

  const products = orderSheet.items.map((item) => {
    const productData = productsStore.findById(item.product.id);
    if (!productData) throw new Error();

    return {
      price: productData.price,
      quantity: item.quantity,
    };
  });

  // orderSheetAmount
  const orderSheetAmount = calculateOrderSheetAmount(products);

  // couponDiscountAmount
  const allCoupons = couponsStore.findAll();
  const selectedCoupons = orderSheet.selectedCoupons.map((couponId) => {
    const coupon = allCoupons.find((couponData) => couponData.id === couponId);
    if (!coupon) throw new Error();

    return coupon.code;
  });

  const shippingFreeBeforeCoupon = calculateAppliedShippingFee(
    orderSheetAmount,
    orderSheet.isRemoteShippingArea,
    false,
    {
      baseShippingFee: 3000,
      remoteAreaAdditionalFee: 3000,
      freeShippingThreshold: 100000,
    },
  );

  const couponDiscountAmount = calculateCouponDiscountAmount(
    products,
    selectedCoupons,
    shippingFreeBeforeCoupon,
  );

  // shippingFee
  const hasFreeShippingFeeCoupon = selectedCoupons.includes("FREESHIPPING");

  const shippingFreeAfterCoupon = calculateAppliedShippingFee(
    orderSheetAmount,
    orderSheet.isRemoteShippingArea,
    hasFreeShippingFeeCoupon,
    {
      baseShippingFee: 3000,
      remoteAreaAdditionalFee: 3000,
      freeShippingThreshold: 100000,
    },
  );

  const paymentAmount = calculatePaymentAmount(
    orderSheetAmount,
    couponDiscountAmount,
    shippingFreeAfterCoupon,
  );

  return {
    orderAmount: orderSheetAmount,
    couponDiscountAmount: couponDiscountAmount,
    shippingFee: shippingFreeAfterCoupon,
    paymentAmount: paymentAmount,
  };
};

export const patchOrderSheetShippingArea = (
  orderSheetId: number,
  isRemoteShippingArea: boolean,
) => {
  const orderSheet = orderSheetStore.updateIsRemoteShippingArea(
    orderSheetId,
    isRemoteShippingArea,
  );

  return orderSheet;
};

export const getOrderSheetAbleCoupons = (orderSheetId: number) => {
  const orderSheet = orderSheetStore.findById(orderSheetId);
  if (!orderSheet) throw new Error();

  const products = orderSheet.products;

  const allCoupons = couponsStore.findAll();

  const orderSheetAmount = calculateOrderSheetAmount(
    products.map((product) => {
      const productData = productsStore.findById(product.id);
      if (!productData) throw new Error();
      return {
        quantity: product.quantity,
        price: productData.price,
      };
    }),
  );

  const ableCoupons = allCoupons
    .filter((coupon) => {
      return canUseCoupon(
        coupon as CanUseCoupon,
        {
          orderSheetAmount,
          products,
          now: new Date(),
        } as CanUseCouponContext,
      );
    })
    .map((coupon) => coupon.code);

  return ableCoupons;
};

export const postOrderSheetCouponDiscountPreview = (
  orderSheetId: number,
  selectedCoupons: number[],
) => {
  const orderSheet = orderSheetStore.findById(orderSheetId);
  if (!orderSheet) throw new Error();

  const products = orderSheet.products.map((product) => {
    const productData = productsStore.findById(product.id);
    if (!productData) throw new Error();
    return {
      quantity: product.quantity,
      price: productData.price,
    };
  });

  const orderSheetAmount = calculateOrderSheetAmount(products);

  const shippingFreeBeforeCoupon = calculateAppliedShippingFee(
    orderSheetAmount,
    orderSheet.isRemoteShippingArea,
    false,
    {
      baseShippingFee: 3000,
      remoteAreaAdditionalFee: 3000,
      freeShippingThreshold: 100000,
    },
  );

  const allCoupons = couponsStore.findAll();
  const selectedCouponCodes = selectedCoupons.map((couponId) => {
    const coupon = allCoupons.find((couponData) => couponData.id === couponId);
    if (!coupon) throw new Error();

    return coupon.code;
  });

  const couponDiscountAmount = calculateCouponDiscountAmount(
    products,
    selectedCouponCodes,
    shippingFreeBeforeCoupon,
  );

  return couponDiscountAmount;
};

export const patchOrderSheetCoupons = (
  orderSheetId: number,
  selectedCoupons: number[],
) => {
  const orderSheet = orderSheetStore.updateSelectedCoupons(
    orderSheetId,
    selectedCoupons,
  );

  return orderSheet;
};
