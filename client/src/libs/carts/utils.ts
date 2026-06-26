import type { Cart, Product } from "@/types/cartProduct";

export const makeCheckedItem = (data: Cart[]) =>
  data.map(({ product }) => product.id);

export const calcOrderAmount = (data: Cart[], checkedItems: Product["id"][]) =>
  data.reduce((acc, { product, quantity }) => {
    return (
      acc + (checkedItems.includes(product.id) ? product.price * quantity : 0)
    );
  }, 0);

export const calcDeliveryFee = (orderAmount: number) =>
  orderAmount >= 100000 ? 0 : 3000;

export const calcTotalAmount = (orderAmount: number, deliveryFee: number) =>
  orderAmount + deliveryFee;
