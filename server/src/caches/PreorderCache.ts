import {randomUUID} from 'node:crypto';

export interface PreorderItemSnapshot {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const preorders = new Map<string, PreorderItemSnapshot[]>();

export const preorderCache = {
  save(items: PreorderItemSnapshot[]) {
    const preorderId = randomUUID();

    preorders.set(preorderId, items);

    return preorderId;
  },

  findById(preorderId: string) {
    return preorders.get(preorderId);
  },

  deleteById(preorderId: string) {
    return preorders.delete(preorderId);
  },
};
