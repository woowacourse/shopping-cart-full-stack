import type { CartItem, Product } from "../type";

export const ProductDB = new Map<number, Product>();
export const CartDB = new Set<CartItem>();

const seedProducts: Product[] = [
  {
    id: 0,
    name: "스타벅스 아메리카노",
    price: 4500,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
  },
  {
    id: 1,
    name: "블루보틀 라떼",
    price: 6000,
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300",
  },
  {
    id: 2,
    name: "이디야 카페모카",
    price: 4800,
    image: "https://images.unsplash.com/photo-1542990253-0b8be9d10f51?w=300",
  },
  {
    id: 3,
    name: "투썸 케이크",
    price: 7500,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
  },
];

seedProducts.forEach((product) => ProductDB.set(product.id, product));

CartDB.add({ product: seedProducts[0], quantity: 2 });
CartDB.add({ product: seedProducts[2], quantity: 1 });
