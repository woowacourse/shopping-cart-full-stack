export type PreorderItem = {
  productId: string;
  price: number;
  name: string;
  imageUrl: string;
  quantity: number;
};

export type Preorder = {
  preorderId: string;
  items: PreorderItem[];
};
