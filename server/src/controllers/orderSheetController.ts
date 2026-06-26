import express from 'express';

import { DEFAULT_USER_ID } from '../constants/user.js';
import { NotFoundError } from '../errors.js';
import Cart from '../models/Cart.js';
import { Storage } from '../storages/Storage.js';
import OrderSheet from '../models/OrderSheet.js';
import Product from '../models/Product.js';
import BaseCoupon from '../models/coupons/Coupon.js';
import {
  createPricingContext,
  createPricingSummary,
} from '../services/orderSheetPricing.js';
import {
  calculateCouponDiscount,
  findAvailableCoupons,
  findBestCouponCombination,
} from '../services/couponDiscount.js';

export interface OrderSheetController {
  create: express.RequestHandler;
  getOrderSheet: express.RequestHandler<{ id: string }>;
  getAvailableCoupons: express.RequestHandler<{ id: string }>;
  getPricing: express.RequestHandler<{ id: string }>;
  previewDiscount: express.RequestHandler<{ id: string }>;
  updateShippingArea: express.RequestHandler<{ id: string }>;
  updateCoupons: express.RequestHandler<{ id: string }>;
}

interface CreateOrderSheetRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}

interface UpdateShippingAreaRequest {
  isRemoteShippingArea: boolean;
}

interface UpdateCouponsRequest {
  selectedCouponIds: string[];
}

interface PreviewDiscountRequest {
  selectedCouponIds: string[];
}

export function createOrderSheetController(
  storage: Storage,
): OrderSheetController {
  return {
    create: (req, res, next) => {
      try {
        const { items }: CreateOrderSheetRequest = req.body;
        const cart = storage.getItemById<Cart>('cart', DEFAULT_USER_ID) as Cart;

        const orderItems = items.map(({ productId, quantity }) => {
          if (!cart.hasItemByProductId(productId)) {
            throw new NotFoundError();
          }

          const product = storage.getItemById<Product>('products', productId);

          if (!product) {
            throw new NotFoundError();
          }

          return {
            product: product.toObject(),
            quantity,
          };
        });

        const orderSheet = new OrderSheet(DEFAULT_USER_ID, orderItems);

        const coupons = storage.allItems<BaseCoupon>('coupons');
        const context = createPricingContext(orderSheet);
        const availableCoupons = findAvailableCoupons(context, coupons);
        const bestCoupons = findBestCouponCombination(
          context,
          availableCoupons,
        );

        orderSheet.updateCouponIds(bestCoupons.map((coupon) => coupon.getId()));
        storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);

        res.status(201).send({ id: orderSheet.getId() });
      } catch (err) {
        next(err);
      }
    },
    getOrderSheet: (req, res, next) => {
      try {
        const { id } = req.params;
        const orderSheet = storage.getItemById<OrderSheet>('orderSheets', id);

        if (!orderSheet) {
          throw new NotFoundError();
        }

        const { userId, ...orderSheetData } = orderSheet.toObject();

        res.status(200).send({
          orderSheet: orderSheetData,
        });
      } catch (err) {
        next(err);
      }
    },
    getAvailableCoupons: (req, res, next) => {
      try {
        const { id } = req.params;
        const orderSheet = storage.getItemById<OrderSheet>('orderSheets', id);

        if (!orderSheet) {
          throw new NotFoundError();
        }

        const coupons = storage.allItems<BaseCoupon>('coupons');
        const context = createPricingContext(orderSheet);
        const availableCoupons = findAvailableCoupons(context, coupons);

        res.status(200).send({
          coupons: availableCoupons.map((coupon) => {
            const { id, code } = coupon.toObject();
            return { id, code };
          }),
        });
      } catch (err) {
        next(err);
      }
    },
    getPricing: (req, res, next) => {
      try {
        const { id } = req.params;
        const orderSheet = storage.getItemById<OrderSheet>('orderSheets', id);

        if (!orderSheet) {
          throw new NotFoundError();
        }

        const { selectedCouponIds } = orderSheet.toObject();
        const selectedCoupons = selectedCouponIds.map((couponId) => {
          const coupon = storage.getItemById<BaseCoupon>('coupons', couponId);

          if (!coupon) {
            throw new NotFoundError();
          }

          return coupon;
        });
        const context = createPricingContext(orderSheet);
        const discountAmount = calculateCouponDiscount(
          context,
          selectedCoupons,
        );

        res.status(200).send({
          pricing: createPricingSummary(context, discountAmount),
        });
      } catch (err) {
        next(err);
      }
    },
    previewDiscount: (req, res, next) => {
      try {
        const { id } = req.params;
        const { selectedCouponIds }: PreviewDiscountRequest = req.body;
        const orderSheet = storage.getItemById<OrderSheet>('orderSheets', id);

        if (!orderSheet) {
          throw new NotFoundError();
        }

        const selectedCoupons = selectedCouponIds.map((couponId) => {
          const coupon = storage.getItemById<BaseCoupon>('coupons', couponId);

          if (!coupon) {
            throw new NotFoundError();
          }

          return coupon;
        });

        const context = createPricingContext(orderSheet);
        const discountAmount = calculateCouponDiscount(
          context,
          selectedCoupons,
        );

        res.status(200).send({ discountAmount });
      } catch (err) {
        next(err);
      }
    },
    updateShippingArea: (req, res, next) => {
      try {
        const { id } = req.params;
        const { isRemoteShippingArea }: UpdateShippingAreaRequest = req.body;
        const orderSheet = storage.getItemById<OrderSheet>('orderSheets', id);

        if (!orderSheet) {
          throw new NotFoundError();
        }

        orderSheet.updateShippingArea(isRemoteShippingArea);
        storage.updateItemById<OrderSheet>('orderSheets', id, orderSheet);

        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
    updateCoupons: (req, res, next) => {
      try {
        const { id } = req.params;
        const { selectedCouponIds }: UpdateCouponsRequest = req.body;
        const orderSheet = storage.getItemById<OrderSheet>('orderSheets', id);

        if (!orderSheet) {
          throw new NotFoundError();
        }

        orderSheet.updateCouponIds(selectedCouponIds);
        storage.updateItemById<OrderSheet>('orderSheets', id, orderSheet);

        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}
