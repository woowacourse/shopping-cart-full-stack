interface RawCart {
  id: number;
  products: RawProductInCart[];
}

interface RawProductInCart {
  id: number;
  quantity: number;
}

export const rawCarts: RawCart[] = [
  {
    id: 1,
    products: [
      {
        id: 1,
        quantity: 2,
      },
      {
        id: 3,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    products: [
      {
        id: 2,
        quantity: 1,
      },
    ],
  },
];
