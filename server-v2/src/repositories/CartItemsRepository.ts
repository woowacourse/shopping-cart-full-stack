import { DUMMY_USER_ID } from '../constants.js';

export interface CartItemRecord {
  productId: string;
  quantity: number;
  checkStatus: boolean;
}

// userId -> productId -> record. 지금은 DUMMY_USER_ID 하나만 쓰지만, 멀티유저로 확장할 수 있게
// 사용자별로 한 번 더 나눠서 보관한다.
const cartItemRecordsByUser = new Map<string, Map<string, CartItemRecord>>();

const getUserCartItems = (userId: string) => {
  if (!cartItemRecordsByUser.has(userId)) {
    cartItemRecordsByUser.set(userId, new Map());
  }

  return cartItemRecordsByUser.get(userId) as Map<string, CartItemRecord>;
};

// 더미 데이터: ProductsRepository의 더미 상품(id '1', '2')을 참조한다.
const dummyCartItemRecords: CartItemRecord[] = [
  { productId: '1', quantity: 2, checkStatus: true },
  { productId: '2', quantity: 1, checkStatus: false },
];

dummyCartItemRecords.forEach((record) => getUserCartItems(DUMMY_USER_ID).set(record.productId, record));

export const getAll = async (userId: string) => {
  return Array.from(getUserCartItems(userId).values());
};

export const getByProductId = async (userId: string, productId: string) => {
  return getUserCartItems(userId).get(productId);
};

export const upsert = async (userId: string, record: CartItemRecord) => {
  getUserCartItems(userId).set(record.productId, record);
  return record;
};

export const setAllCheckStatus = async (userId: string, checkStatus: boolean) => {
  const userCartItems = getUserCartItems(userId);
  const updated = Array.from(userCartItems.values()).map((record) => ({
    ...record,
    checkStatus,
  }));
  updated.forEach((record) => userCartItems.set(record.productId, record));
  return updated;
};

export const deleteByProductId = async (userId: string, productId: string) => {
  const userCartItems = getUserCartItems(userId);
  const record = userCartItems.get(productId);

  if (!record) return null;

  userCartItems.delete(productId);
  return record;
};
