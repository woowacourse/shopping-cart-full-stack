interface ProductBase {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
}

interface ProductType extends ProductBase {
  quantity: number;
}

interface CartItemType extends ProductBase {
  orderCount: number;
  isSelected: boolean;
}

export type { ProductBase, ProductType, CartItemType };
