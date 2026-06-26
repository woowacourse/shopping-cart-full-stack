import express from "express";
import {
  CartRepository,
  CouponRepository,
  ProductRepository,
  TempOrderRepository,
} from "./repositories/InMemoryRepositories.js";
import { ProductService } from "./services/ProductService.js";
import { CartService } from "./services/CartService.js";
import { TempOrderService } from "./services/TempOrderService.js";
import { CouponService } from "./services/CouponService.js";
import { DiscountSummaryService } from "./services/DiscountSummaryService.js";

export interface ProductController {
  get: express.RequestHandler;
  add: express.RequestHandler;
  delete: express.RequestHandler;
}

export interface CartController {
  get: express.RequestHandler;
  update: express.RequestHandler<{ id: string }>;
  delete: express.RequestHandler<{ id: string }>;
}

export interface TempOrderController {
  get: express.RequestHandler;
  post: express.RequestHandler;
  patch: express.RequestHandler;
}

export interface CouponController {
  get: express.RequestHandler;
}

export interface DiscountSummaryController {
  post: express.RequestHandler;
}

export function createProductController({
  productRepository,
  cartRepository,
}: {
  productRepository: ProductRepository;
  cartRepository: CartRepository;
}): ProductController {
  const service = new ProductService(productRepository, cartRepository);
  return {
    get: (_req, res, next) => {
      try {
        res.send(service.getAll());
      } catch (err) {
        next(err);
      }
    },
    add: (req, res, next) => {
      try {
        res.status(201).send(service.add(req.body));
      } catch (err) {
        next(err);
      }
    },
    delete: (req, res, next) => {
      try {
        service.delete(req.params.id as string);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}

export function createCartController({
  cartRepository,
  productRepository,
}: {
  cartRepository: CartRepository;
  productRepository: ProductRepository;
}): CartController {
  const service = new CartService(cartRepository, productRepository);
  return {
    get: (_req, res, next) => {
      try {
        res.send(service.getAll());
      } catch (err) {
        next(err);
      }
    },
    update: (req, res, next) => {
      try {
        res.status(200).send(service.update(req.params.id, req.body.quantity));
      } catch (err) {
        next(err);
      }
    },
    delete: (req, res, next) => {
      try {
        service.delete(req.params.id);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}

export function createTempOrderController({
  tempOrderRepository,
  productRepository,
  couponRepository,
}: {
  tempOrderRepository: TempOrderRepository;
  productRepository: ProductRepository;
  couponRepository: CouponRepository;
}): TempOrderController {
  const service = new TempOrderService(
    tempOrderRepository,
    productRepository,
    couponRepository,
  );
  return {
    get: (req, res, next) => {
      try {
        res.status(200).send(service.getById(req.params.id as string));
      } catch (err) {
        next(err);
      }
    },
    post: (req, res, next) => {
      try {
        res.status(201).send(service.create(req.body));
      } catch (err) {
        next(err);
      }
    },
    patch: (req, res, next) => {
      try {
        res.status(200).send(service.patch(req.params.id as string, req.body));
      } catch (err) {
        next(err);
      }
    },
  };
}

export function createCouponController({
  couponRepository,
  tempOrderRepository,
}: {
  couponRepository: CouponRepository;
  tempOrderRepository: TempOrderRepository;
}): CouponController {
  const service = new CouponService(couponRepository, tempOrderRepository);
  return {
    get: (req, res, next) => {
      try {
        res.status(200).send(service.getByOrderId(req.params.id as string));
      } catch (err) {
        next(err);
      }
    },
  };
}

export function createDiscountSummaryController({
  tempOrderRepository,
  couponRepository,
}: {
  tempOrderRepository: TempOrderRepository;
  couponRepository: CouponRepository;
}): DiscountSummaryController {
  const service = new DiscountSummaryService(
    tempOrderRepository,
    couponRepository,
  );
  return {
    post: (req, res, next) => {
      try {
        res
          .status(200)
          .send(service.calculate(req.params.id as string, req.body.selected_coupons));
      } catch (err) {
        next(err);
      }
    },
  };
}
