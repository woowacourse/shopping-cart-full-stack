import type { ServerProduct } from "@/apis/carts/dto";

export const products: ServerProduct[] = [
  {
    id: 1,
    imgUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    name: "무선 헤드폰",
    price: 129000,
  },
  {
    id: 2,
    imgUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    name: "러닝화",
    price: 89000,
  },
  {
    id: 3,
    imgUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    name: "스마트 워치",
    price: 215000,
  },
];
