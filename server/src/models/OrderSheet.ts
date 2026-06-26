import { ProductType } from './Product.js';

export interface OrderSheetItem {
  product: ProductType;
  quantity: number;
}

export interface OrderSheetType {
  id: string;
  userId: string;
  items: OrderSheetItem[];
  selectedCouponIds: string[];
  isRemoteShippingArea: boolean;
}

class OrderSheet {
  #id: string;
  #userId: string;
  #items: OrderSheetItem[];
  #selectedCouponIds: string[];
  #isRemoteShippingArea: boolean;

  constructor(userId: string, items: OrderSheetItem[]) {
    this.#id = crypto.randomUUID();
    this.#userId = userId;
    this.#items = items;
    this.#selectedCouponIds = [];
    this.#isRemoteShippingArea = false;
  }

  getId() {
    return this.#id;
  }

  updateShippingArea(isRemoteShippingArea: boolean) {
    this.#isRemoteShippingArea = isRemoteShippingArea;
  }

  updateCouponIds(selectedCouponIds: string[]) {
    this.#selectedCouponIds = selectedCouponIds;
  }

  toObject(): OrderSheetType {
    return {
      id: this.#id,
      userId: this.#userId,
      items: this.#items,
      selectedCouponIds: this.#selectedCouponIds,
      isRemoteShippingArea: this.#isRemoteShippingArea,
    };
  }
}

export default OrderSheet;
