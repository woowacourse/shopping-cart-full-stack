export interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
}

export const cartItemData: CartItemData[] = [
  {id: '1', productId: '1', quantity: 1},
  {id: '2', productId: '2', quantity: 1},
  {id: '3', productId: '3', quantity: 2},
  {id: '4', productId: '4', quantity: 3},
  {id: '5', productId: '5', quantity: 3},
  {id: '6', productId: '6', quantity: 5},
  {id: '7', productId: '7', quantity: 8},
  {id: '8', productId: '8', quantity: 13},
  {id: '9', productId: '9', quantity: 21},
  {id: '10', productId: '10', quantity: 34},
];
