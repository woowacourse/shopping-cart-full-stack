import type { CartItemResponse } from "./cartSchema";
import type { CartItem } from "../../domain/cart";

export function toCartItem(item: CartItemResponse): CartItem {
  return {
    id: item.id,
    name: item.name,
    imageUrl: item.image_url,
    price: item.price,
    quantity: item.quantity,
    stock: item.stock,
    status: item.status,
  };
}
