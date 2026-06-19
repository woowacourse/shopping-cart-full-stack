import {randomUUID} from 'node:crypto';

const PREORDER_TTL_MS = 10 * 60 * 1000; //10분

export interface PreorderItemSnapshot {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface PreorderPreview {
  couponIds: number[];
  isRemoteArea: boolean;
}

interface PreorderSession {
  items: PreorderItemSnapshot[];
  expiresAt: number;
  preview?: PreorderPreview;
}

const preorders = new Map<string, PreorderSession>();

export const preorderCache = {
  save(items: PreorderItemSnapshot[]) {
    const preorderId = randomUUID();
    const expiresAt = Date.now() + PREORDER_TTL_MS;

    preorders.set(preorderId, {
      items,
      expiresAt,
    });

    return preorderId;
  },

  findById(preorderId: string) {
    const preorder = preorders.get(preorderId);

    if (!preorder) {
      return undefined;
    }

    if (preorder.expiresAt < Date.now()) {
      preorders.delete(preorderId);
      return undefined;
    }

    return preorder;
  },

  deleteById(preorderId: string) {
    return preorders.delete(preorderId);
  },

  savePreview(preorderId: string, preview: PreorderPreview) {
    const preorder = this.findById(preorderId);

    if (!preorder) {
      return false;
    }

    preorders.set(preorderId, {
      ...preorder,
      preview,
    });

    return true;
  },
};
