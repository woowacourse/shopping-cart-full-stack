import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import TempOrder from "../models/TempOrder.js";
import { Coupon } from "../models/Coupon.js";

export interface CartRepository {
  get: () => Cart;
}

export interface ProductRepository {
  findById: (id: string) => Product | undefined;
  save: (id: string, obj: Product) => Map<string, Product>;
  exists: (id: string) => boolean;
  update: (id: string, obj: Product) => Map<string, Product>;
  delete: (id: string) => void;
  findAll: () => Product[];
  clearAll: () => void;
}

export interface TempOrderRepository {
  findById: (id: string) => TempOrder | undefined;
  save: (id: string, obj: TempOrder) => void;
  findAll: () => TempOrder[];
  clearAll: () => void;
}

export interface CouponRepository {
  save: (id: string, obj: Coupon) => void;
  findById: (id: string) => Coupon | undefined;
  findAll: () => Coupon[];
}

export class InMemoryCartRepository implements CartRepository {
  private cart = new Cart();

  get() {
    return this.cart;
  }
}

export class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  findById(id: string) {
    return this.products.get(id);
  }

  save(id: string, obj: Product) {
    return this.products.set(id, obj);
  }

  exists(id: string): boolean {
    return this.products.has(id);
  }

  update(id: string, obj: Product) {
    return this.products.set(id, obj);
  }

  delete(id: string) {
    return this.products.delete(id);
  }

  findAll() {
    return [...this.products.values()];
  }

  clearAll() {
    return (this.products = new Map());
  }
}

export class InMemoryTempOrderRepository implements TempOrderRepository {
  private tempOrders = new Map<string, TempOrder>();

  findById(id: string) {
    return this.tempOrders.get(id);
  }

  save(id: string, obj: TempOrder) {
    this.tempOrders.set(id, obj);
  }

  findAll() {
    return [...this.tempOrders.values()];
  }

  clearAll() {
    return (this.tempOrders = new Map());
  }
}

export class InMemoryCouponRepository implements CouponRepository {
  private coupons = new Map<string, Coupon>();

  save(id: string, obj: Coupon) {
    this.coupons.set(id, obj);
  }

  findById(id: string) {
    return this.coupons.get(id);
  }

  findAll() {
    return [...this.coupons.values()];
  }

  clearAll() {
    return (this.coupons = new Map());
  }
}
