import type {
  PostOrderRequest,
  PostOrderResponse,
  OrderProductDetail,
  GetOrderResponse,
  PatchOrderRequest,
  PatchOrderResponse,
  GetDiscountRequest,
  GetDiscountResponse,
  Coupon,
  GetCouponsResponse,
} from "@/types/order";

export interface ServerOrderProduct {
  id: number;
  quantity: number;
}

export interface ServerPostOrderRequest {
  products: ServerOrderProduct[];
}

export interface ServerPostOrderResponse {
  status: number;
  data: {
    orderId: number;
  };
}

export interface ServerOrderProductDetail {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
  hasGift: boolean;
}

export interface ServerGetOrderResponse {
  status: number;
  data: {
    products: ServerOrderProductDetail[];
    coupons: number[];
    isRemoteArea: boolean;
    deliveryFee?: number;
  };
}

export interface ServerPatchOrderRequest {
  couponId?: number[];
  isRemoteArea?: boolean;
}

export interface ServerPatchOrderResponse {
  status: number;
  data: {
    couponId?: number[];
    isRemoteArea?: boolean;
    deliveryFee?: number;
  };
}

export interface ServerGetDiscountRequest {
  couponId?: number[];
}

export interface ServerGetDiscountResponse {
  status: number;
  data: {
    discountAmount: number;
  };
}

export interface ServerCoupon {
  id: number;
  name: string;
  expirationDate: string;
  minOrderAmount?: number;
  availableHours?: string;
  isCouponUsable: boolean;
}

export interface ServerGetCouponsResponse {
  status: number;
  data: {
    coupons: ServerCoupon[];
  };
}

export const mapPostOrderRequestToServer = (req: PostOrderRequest): ServerPostOrderRequest => ({
  products: req.products.map((p) => ({
    id: p.id,
    quantity: p.quantity,
  })),
});

export const mapPatchOrderRequestToServer = (req: PatchOrderRequest): ServerPatchOrderRequest => ({
  couponId: req.couponId,
  isRemoteArea: req.isRemoteArea,
});

export const mapGetDiscountRequestToServer = (req: GetDiscountRequest): ServerGetDiscountRequest => ({
  couponId: req.couponId,
});

export const mapServerPostOrderResponseToResponse = (response: ServerPostOrderResponse): PostOrderResponse => ({
  orderId: response.data.orderId,
});

export const mapServerOrderProductDetailToDetail = (product: ServerOrderProductDetail): OrderProductDetail => ({
  id: product.id,
  name: product.name,
  price: product.price,
  imgUrl: product.imgUrl,
  quantity: product.quantity,
  hasGift: product.hasGift,
});

export const mapServerGetOrderResponseToResponse = (response: ServerGetOrderResponse): GetOrderResponse => ({
  products: response.data.products.map(mapServerOrderProductDetailToDetail),
  coupons: response.data.coupons,
  isRemoteArea: response.data.isRemoteArea,
  deliveryFee: response.data.deliveryFee,
});

export const mapServerPatchOrderResponseToResponse = (response: ServerPatchOrderResponse): PatchOrderResponse => ({
  couponId: response.data.couponId,
  isRemoteArea: response.data.isRemoteArea,
  deliveryFee: response.data.deliveryFee,
});

export const mapServerGetDiscountResponseToResponse = (response: ServerGetDiscountResponse): GetDiscountResponse => ({
  discountAmount: response.data.discountAmount,
});

export const mapServerCouponToCoupon = (coupon: ServerCoupon): Coupon => ({
  id: coupon.id,
  name: coupon.name,
  expirationDate: coupon.expirationDate,
  minOrderAmount: coupon.minOrderAmount,
  availableHours: coupon.availableHours,
  isCouponUsable: coupon.isCouponUsable,
});

export const mapServerGetCouponsResponseToResponse = (response: ServerGetCouponsResponse): GetCouponsResponse => ({
  coupons: response.data.coupons.map(mapServerCouponToCoupon),
});
