import type { OrderCheckProduct } from '../dto/orderCheck.dto.js';

export interface OrderCheckRecord {
  products: OrderCheckProduct[];
  remoteAreaCheckStatus: boolean;
  selectedCouponIds: string[];
}

// 더미 저장소: 사용자당 주문 확인은 1건만 존재한다고 가정한다. userId로 구분해서 보관해
// 멀티유저를 받을 수 있게 해둔다.
const orderCheckRecordsByUser = new Map<string, OrderCheckRecord>();

export const getOrder = async (userId: string) => {
  return orderCheckRecordsByUser.get(userId) ?? null;
};

export const createOrder = async (userId: string, products: OrderCheckProduct[]) => {
  const record: OrderCheckRecord = { products, remoteAreaCheckStatus: false, selectedCouponIds: [] };
  orderCheckRecordsByUser.set(userId, record);
  return record;
};

export const setRemoteAreaCheckStatus = async (record: OrderCheckRecord, checkStatus: boolean) => {
  record.remoteAreaCheckStatus = checkStatus;
  return record;
};

export const setSelectedCouponIds = async (record: OrderCheckRecord, couponIds: string[]) => {
  record.selectedCouponIds = couponIds;
  return record;
};
