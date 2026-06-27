import { supabase } from "@db/supabase";
import type { Coupon, Product } from "@/type";
import type { OrderProduct } from "./orders.schema";

export type OrderRow = {
  id: number;
  isExpired: boolean;
  isRemoteArea: boolean;
  deliveryFee: number;
};

export type OrderProductRow = Product & { quantity: number };

type ProductWithStock = Product & { stock: number };

const DB_DISCOUNT_TYPE_MAP: Record<string, Coupon["discountType"]> = {
  FIXED: "fixed",
  BOGO: "buyXgetY",
  FREESHIPPING: "freeShipping",
  MIRACLESALE: "percentage",
};

const toTimeString = (hour: number) =>
  `${String(hour).padStart(2, "0")}:00`;

const mapToCoupon = (row: Record<string, unknown>): Coupon => ({
  id: row.id as number,
  code: (row.code as string) ?? "",
  title: row.title as string,
  discountType: DB_DISCOUNT_TYPE_MAP[row.discount_type as string],
  discountValue: (row.discount_value as number) ?? 0,
  minimumAmount: (row.min_order_amount as number) ?? undefined,
  expirationDate: row.expiration_date as string,
  availableTime:
    row.available_hours_start != null
      ? {
          start: toTimeString(row.available_hours_start as number),
          end: toTimeString(row.available_hours_end as number),
        }
      : undefined,
});

export const getProductWithStockQuery = async (
  productId: number,
): Promise<ProductWithStock | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, stock")
    .eq("id", productId)
    .single();

  if (error || !data) return null;
  return data as ProductWithStock;
};

export const reserveProductsQuery = async (
  items: OrderProduct[],
): Promise<void> => {
  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    await supabase
      .from("products")
      .update({ stock: (product?.stock ?? 0) - item.quantity })
      .eq("id", item.id);
  }
};

export const getAllCouponsQuery = async (): Promise<Coupon[]> => {
  const { data, error } = await supabase.from("coupons").select("*");

  if (error || !data) return [];
  return data.map(mapToCoupon);
};

export const getProductsByIdsQuery = async (
  productIds: number[],
): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image")
    .in("id", productIds);

  if (error || !data) return [];
  return data as Product[];
};

export const createOrderQuery = async (): Promise<{ id: number }> => {
  const { data, error } = await supabase
    .from("orders")
    .insert({ is_expired: false, is_remote_area: false, delivery_fee: 3000 })
    .select("id")
    .single();

  if (error || !data) throw new Error(`주문 생성에 실패했습니다. ${error?.message}`);
  return data as { id: number };
};

export const createOrderProductsQuery = async (
  orderId: number,
  items: (OrderProduct & { price: number })[],
): Promise<void> => {
  const rows = items.map((item) => ({
    order_id: orderId,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error } = await supabase.from("order_products").insert(rows);
  if (error) throw new Error(`주문 상품 저장에 실패했습니다. ${error.message}`);
};

export const createOrderCouponsQuery = async (
  orderId: number,
  couponIds: number[],
): Promise<void> => {
  const rows = couponIds.map((couponId) => ({
    order_id: orderId,
    coupon_id: couponId,
  }));

  const { error } = await supabase.from("order_coupons").insert(rows);
  if (error) throw new Error("주문 쿠폰 저장에 실패했습니다.");
};

export const getOrderByIdQuery = async (
  orderId: number,
): Promise<OrderRow | null> => {
  const { data, error } = await supabase
    .from("orders")
    .select("id, is_expired, is_remote_area, delivery_fee")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    isExpired: data.is_expired,
    isRemoteArea: data.is_remote_area,
    deliveryFee: data.delivery_fee,
  };
};

export const getOrderProductsByOrderIdQuery = async (
  orderId: number,
): Promise<OrderProductRow[]> => {
  const { data, error } = await supabase
    .from("order_products")
    .select("quantity, price, products(id, name, image)")
    .eq("order_id", orderId);

  if (error || !data) return [];

  return data.map((row) => {
    const product = row.products as unknown as { id: number; name: string; image: string };
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      price: row.price as number,
      quantity: row.quantity as number,
    };
  });
};

export const getOrderCouponsByOrderIdQuery = async (
  orderId: number,
): Promise<Coupon[]> => {
  const { data, error } = await supabase
    .from("order_coupons")
    .select("coupons(*)")
    .eq("order_id", orderId);

  if (error || !data) return [];

  return data
    .map((row) => row.coupons)
    .filter(Boolean)
    .map((c) => mapToCoupon(c as unknown as Record<string, unknown>));
};

export const updateOrderCouponsQuery = async (
  orderId: number,
  couponIds: number[],
): Promise<void> => {
  const { error: deleteError } = await supabase
    .from("order_coupons")
    .delete()
    .eq("order_id", orderId);
  if (deleteError) throw new Error("주문 쿠폰 삭제에 실패했습니다.");

  if (couponIds.length === 0) return;

  const rows = couponIds.map((couponId) => ({
    order_id: orderId,
    coupon_id: couponId,
  }));
  const { error: insertError } = await supabase.from("order_coupons").insert(rows);
  if (insertError) throw new Error("주문 쿠폰 저장에 실패했습니다.");
};

export const updateOrderIsRemoteAreaQuery = async (
  orderId: number,
  isRemoteArea: boolean,
  deliveryFee: number,
): Promise<void> => {
  const { error } = await supabase
    .from("orders")
    .update({ is_remote_area: isRemoteArea, delivery_fee: deliveryFee })
    .eq("id", orderId);
  if (error) throw new Error("배송지 정보 업데이트에 실패했습니다.");
};

export const updateOrderProductGiftsQuery = async (
  orderId: number,
  giftProductId: number | null,
): Promise<void> => {
  await supabase
    .from("order_products")
    .update({ is_gift: false })
    .eq("order_id", orderId);

  if (giftProductId !== null) {
    await supabase
      .from("order_products")
      .update({ is_gift: true })
      .eq("order_id", orderId)
      .eq("product_id", giftProductId);
  }
};

export const removeExpiredCouponsFromOrderQuery = async (
  orderId: number,
  expiredCouponIds: number[],
): Promise<void> => {
  await supabase
    .from("order_coupons")
    .delete()
    .eq("order_id", orderId)
    .in("coupon_id", expiredCouponIds);
};
