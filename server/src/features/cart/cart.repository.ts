import { type InMemoryDB } from "../../db/in-memory-db.js";
import { type CartEntity } from "./cart.entity.js";
import { type ProductEntity } from "../product/product.entity.js";

export interface CartDetail {
  product: ProductEntity;
  quantity: number;
}

export interface CartRepository {
  findAll: () => Promise<CartDetail[]>;
  findByProductId: (productId: number) => Promise<CartEntity | undefined>;
  save: (cartItem: CartEntity) => Promise<CartEntity>;
  remove: (productId: number) => Promise<void>;
}

export default class InMemoryCartRepository implements CartRepository {
  constructor(private db: InMemoryDB) {}

  // 조인 기능 나중에 변경되면 디비가 알아서 하니까 레포단계에서 구현
  async findAll(): Promise<CartDetail[]> {
    return this.db.CART_TABLE.map((cart) => {
      const product = this.db.PRODUCT_TABLE.find((p) => p.id === cart.product_id);
      return {
        product: {
          id: cart.product_id,
          name: product?.name ?? "",
          price: product?.price ?? 0,
          imgUrl: product?.imgUrl ?? "",
        },
        quantity: cart.quantity,
      };
    });
  }

  async findByProductId(productId: number) {
    return this.db.CART_TABLE.find((item) => item.product_id === productId);
  }

  async save(cart: CartEntity) {
    const newCart = this.db.CART_TABLE.find((item) => item.product_id === cart.product_id);
    if (newCart) {
      newCart.quantity = cart.quantity;
      return newCart;
    }
    this.db.CART_TABLE.push(cart);
    return cart;
  }

  async remove(productId: number) {
    this.db.CART_TABLE = this.db.CART_TABLE.filter((item) => item.product_id !== productId);
  }
}
