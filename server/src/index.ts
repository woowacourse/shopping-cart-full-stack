import { runApp } from "./app";
import InMemoryCartRepository from "./repositories/InMemoryCartRepository";
import InMemoryCouponRepository from "./repositories/InMemoryCouponRepository";
import InMemoryOrderRepository from "./repositories/InMemoryOrderRepository";
import InMemoryPreorderRepository from "./repositories/InMemoryPreorderRepository";
import InMemoryProductRepository from "./repositories/InMemoryProductRepository";

const PORT = process.env.PORT ?? 3000;

const repositories = {
  productRepo: new InMemoryProductRepository(),
  cartRepo: new InMemoryCartRepository(),
  couponRepo: new InMemoryCouponRepository(),
  orderRepo: new InMemoryOrderRepository(),
  preorderRepo: new InMemoryPreorderRepository(),
};

repositories.productRepo.addProduct({
  name: "아메리카노",
  price: 4500,
  thumbnailUrl: "https://media.sodagift.com/img/image/665587415880572.jpg",
  totalQuantity: 999,
});

repositories.productRepo.addProduct({
  name: "바닐라 라떼",
  price: 5500,
  thumbnailUrl:
    "https://thebreadbag.co.kr/wp-content/uploads/2025/03/%EB%B9%B5%EB%B0%B1%ED%99%94%EC%A0%90_%EC%A0%95%EC%82%AC%EA%B0%81-1280x1280_0000s_0005_%EB%B0%B0%EB%AF%BC1280x960_%EC%9D%8C%EB%A3%8C_%EB%B3%B4%EC%A0%95%EB%B3%B8_0005_%EB%B0%94%EB%8B%90%EB%9D%BC%EB%9D%BC%EB%96%BC-%EB%B3%B5%EC%82%AC.jpg",
  totalQuantity: 999,
});

repositories.cartRepo.addProductToCart(1, 2);
repositories.cartRepo.addProductToCart(2, 1);

repositories.couponRepo.addCoupon({
  couponId: 1,
  name: "5,000원 할인 쿠폰",
  type: "DISCOUNT",
  expirationDate: "2026-11-30",
  condition: { minOrderLimit: 100000 },
  benefit: { discountAmount: 5000 },
});

repositories.couponRepo.addCoupon({
  couponId: 2,
  name: "2+1 쿠폰",
  type: "BOGO",
  expirationDate: "2026-06-30",
  condition: { minBogoQuantity: 2 },
  benefit: { bogoFreeQuantity: 1 },
});

repositories.couponRepo.addCoupon({
  couponId: 3,
  name: "무료 배송 쿠폰",
  type: "FREESHIPPING",
  expirationDate: "2026-08-31",
  condition: { minOrderLimit: 50000 },
  benefit: {},
});

repositories.couponRepo.addCoupon({
  couponId: 4,
  name: "30% 시간제 할인 쿠폰",
  type: "TIMESALE",
  expirationDate: "2026-07-31",
  condition: { validTime: { startHour: 4, endHour: 7 } },
  benefit: { discountRate: 0.3 },
});

const app = runApp(repositories);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
