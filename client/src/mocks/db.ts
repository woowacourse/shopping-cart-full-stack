// server/ 의 InMemory 저장소(Map)와 시드 데이터를 그대로 미러링한 목 DB.
// 핸들러가 이 저장소를 직접 변경하므로 실제 서버처럼 상태가 보존된다.
// (브라우저 새로고침 시 모듈이 재평가되어 시드 상태로 초기화된다.)

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

type DiscountInfo =
  | { type: "percentage"; value: number }
  | { type: "fixed"; value: number }
  | { type: "freeShipping" }
  | { type: "bogo"; target: "max"; requireAmount: number };

export interface CouponDB {
  couponId: string;
  couponName: string;
  isDisabled: boolean;
  couponExpiration: number;
  discountInfo: DiscountInfo & {
    minimumOrderPrice: number;
    duration: {
      startDate: number;
      endDate: number;
    };
  };
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface OrdersDB {
  orderId: string;
  orderProducts: OrderProduct[];
  isIsland: boolean;
  couponIds: string[];
}

export const createId = () => crypto.randomUUID();

// server/src/modules/products/repository 시드
const createSeedProducts = (): Product[] => [
  {
    id: "0",
    name: "스타벅스 아메리카노",
    price: 4500,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
  },
  {
    id: "1",
    name: "블루보틀 라떼",
    price: 6000,
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300",
  },
  {
    id: "2",
    name: "이디야 카페모카",
    price: 4800,
    image: "https://images.unsplash.com/photo-1542990253-0b8be9d10f51?w=300",
  },
  {
    id: "3",
    name: "투썸 케이크",
    price: 7500,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
  },
];

// server/src/modules/carts/repository 시드
const createSeedCarts = (): CartItem[] => [
  {
    product: {
      id: "0",
      name: "스타벅스 아메리카노",
      price: 4500,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    },
    quantity: 2,
  },
  {
    product: {
      id: "1",
      name: "블루보틀 라떼",
      price: 6000,
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300",
    },
    quantity: 1,
  },
];

// server/src/modules/coupons/repository 시드
const createSeedCoupons = (): CouponDB[] => [
  {
    couponId: "FIXED5000",
    couponName: "5,000원 할인 쿠폰",
    isDisabled: false,
    couponExpiration: 1796050799000, // 2026-11-30T23:59:59 (KST), 명세 고정값
    discountInfo: {
      type: "fixed",
      value: 5000,
      minimumOrderPrice: 100000,
      duration: { startDate: 0, endDate: 24 },
    },
  },
  {
    couponId: "BOGO",
    couponName: "2+1 쿠폰",
    isDisabled: false,
    couponExpiration: 1782831599000, // 2026-06-30T23:59:59 (KST), 명세 고정값
    discountInfo: {
      type: "bogo",
      target: "max",
      requireAmount: 2,
      minimumOrderPrice: 0,
      duration: { startDate: 0, endDate: 24 },
    },
  },
  {
    couponId: "FREESHIPPING",
    couponName: "무료 배송 쿠폰",
    isDisabled: false,
    couponExpiration: 1788188399000, // 2026-08-31T23:59:59 (KST), 명세 고정값
    discountInfo: {
      type: "freeShipping",
      minimumOrderPrice: 50000,
      duration: { startDate: 0, endDate: 24 },
    },
  },
  {
    couponId: "MIRACLESALE",
    couponName: "30% 시간제 할인 쿠폰",
    isDisabled: false,
    couponExpiration: 1785509999000, // 2026-07-31T23:59:59 (KST), 명세 고정값
    discountInfo: {
      type: "percentage",
      value: 30,
      minimumOrderPrice: 0,
      duration: { startDate: 4, endDate: 7 },
    },
  },
];

export const db = {
  products: new Map<string, Product>(),
  carts: new Map<string, CartItem>(),
  coupons: new Map<string, CouponDB>(),
  orders: new Map<string, OrdersDB>(),
};

/** 저장소를 시드 상태로 초기화한다. */
export const resetDb = () => {
  db.products.clear();
  db.carts.clear();
  db.coupons.clear();
  db.orders.clear();

  createSeedProducts().forEach((product) =>
    db.products.set(product.id, product),
  );
  createSeedCarts().forEach((cart) => db.carts.set(cart.product.id, cart));
  createSeedCoupons().forEach((coupon) =>
    db.coupons.set(coupon.couponId, coupon),
  );
};

resetDb();
