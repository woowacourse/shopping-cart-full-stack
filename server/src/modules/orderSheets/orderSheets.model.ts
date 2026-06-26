export class OrderSheet {
  id: number;
  products: { id: number; quantity: number }[];
  isRemoteShippingArea: boolean;
  selectedCoupons: number[];

  constructor({
    id,
    products,
    isRemoteShippingArea,
    selectedCoupons,
  }: {
    id: number;
    products: { id: number; quantity: number }[];
    isRemoteShippingArea: boolean;
    selectedCoupons: number[];
  }) {
    this.id = id;
    this.products = products;
    this.isRemoteShippingArea = isRemoteShippingArea;
    this.selectedCoupons = selectedCoupons;
  }
}
