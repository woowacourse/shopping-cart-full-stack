import type { CouponCode, OrderData, OrderProduct } from '../types/type.ts';

export default class Order {
  private id: string = crypto.randomUUID();
  private orderProducts: OrderProduct[] = [];
  private isRemoteArea: boolean = false;
  private orderAmount: number = 0;
  private discountAmount: number = 0;
  private shippingFee: number = 0;
  private totalAmount: number = 0;
  private selectedCouponCodes: CouponCode[] = [];
  private isCouponSelectionConfirmed: boolean = false;

  createOrder(products: OrderProduct[]) {
    this.orderProducts = products;
    this.#calculateOrderAmount(this.orderProducts);
    this.#calculateShippingFee();
    this.#calculateTotalAmount();
  }

  #calculateOrderAmount(orderProducts: OrderProduct[]) {
    this.orderAmount = orderProducts.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  #calculateShippingFee() {
    this.shippingFee = this.orderAmount >= 100000 ? 0 : 3000;
    this.shippingFee += this.isRemoteArea ? 3000 : 0;
  }

  #calculateTotalAmount() {
    this.totalAmount =
      this.orderAmount - this.discountAmount + this.shippingFee;
  }

  setAmount(discountAmount: number, totalAmount: number) {
    this.discountAmount = discountAmount;
    this.totalAmount = totalAmount;
  }

  applyDiscount(discountAmount: number) {
    this.discountAmount = discountAmount;
    this.#calculateTotalAmount();
  }

  setSelectedCouponCodes(couponCodes: CouponCode[]) {
    this.selectedCouponCodes = couponCodes;
  }

  hasSelectedCoupon(couponCode: CouponCode) {
    return this.selectedCouponCodes.includes(couponCode);
  }

  getSelectedCouponCodes() {
    return this.selectedCouponCodes;
  }

  confirmCouponSelection() {
    this.isCouponSelectionConfirmed = true;
  }

  hasConfirmedCouponSelection() {
    return this.isCouponSelectionConfirmed;
  }

  setRemoteArea(isRemoteArea: boolean) {
    this.isRemoteArea = isRemoteArea;
    this.#calculateShippingFee();
    this.#calculateTotalAmount();
  }

  getId() {
    return this.id;
  }

  getOrderData() {
    return { products: this.orderProducts, isRemoteArea: this.isRemoteArea };
  }

  getOrder(): OrderData {
    return {
      id: this.id,
      products: this.orderProducts,
      isRemoteArea: this.isRemoteArea,
      amount: {
        orderAmount: this.orderAmount,
        discountAmount: this.discountAmount,
        shippingFee: this.shippingFee,
        totalAmount: this.totalAmount,
      },
    };
  }
}
