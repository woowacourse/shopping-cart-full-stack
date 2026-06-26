// GetOrderSheet
export interface GetOrderSheetParams {
  id: number;
}

export type GetOrderSheet = (params: GetOrderSheetParams) => Promise<{
  products: {
    id: number;
    quantity: number;
    name: string;
    price: number;
    imgUrl: string;
  }[];
  isRemoteArea: boolean;
  selectedCoupons: number[];
}>;

// PostOrderSheet
export interface PostOrderSheetCommand {
  cartId: number;
  productIds: number[];
}

export type PostOrderSheet = (command: PostOrderSheetCommand) => Promise<{
  id: number;
}>;

// GetOrderSheetPricing
export interface GetOrderSheetPricingParams {
  id: number;
}

export type GetOrderSheetPricing = (
  params: GetOrderSheetPricingParams,
) => Promise<{
  orderSheetAmount: number;
  discountAmount: number;
  shippingFee: number;
  paymentAmount: number;
}>;

// PatchOrderSheetShippingArea
export interface PatchOrderSheetShippingAreaCommand {
  id: number;
  isRemoteArea: boolean;
}

export type PatchOrderSheetShippingArea = (
  command: PatchOrderSheetShippingAreaCommand,
) => Promise<void>;

// PatchOrderSheetCoupons
export interface PatchOrderSheetCouponsCommand {
  id: number;
  selectedCoupons: number[];
}

export type PatchOrderSheetCoupons = (
  params: PatchOrderSheetCouponsCommand,
) => Promise<void>;

// GetOrderSheetAbleCoupons
export interface GetOrderSheetAbleCouponsParams {
  id: number;
}

export type GetOrderSheetAbleCoupons = (
  params: GetOrderSheetAbleCouponsParams,
) => Promise<{
  ableCoupons: string[];
}>;

// GetOrderSheetCouponsDiscountPreview
export interface PostOrderSheetCouponsDiscountPreviewParams {
  id: number;
  selectedCoupons: number[];
}

export type PostOrderSheetCouponsDiscountPreview = (
  params: PostOrderSheetCouponsDiscountPreviewParams,
) => Promise<{ discountAmount: number }>;
