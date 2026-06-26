interface RawProductInOrderSheet {
  id: number;
  quantity: number;
}

type RawCoupon = number;

interface RawOrderSheet {
  id: number;
  products: RawProductInOrderSheet[];
  remoteArea: boolean;
  coupons: RawCoupon[];
}

const createOrderSheets = () => {
  const rawOrderSheets: RawOrderSheet[] = [
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
      remoteArea: false,
      coupons: [4],
    },
    {
      id: 2,
      products: [
        {
          id: 2,
          quantity: 1,
        },
      ],
      remoteArea: false,
      coupons: [4],
    },
    {
      id: 3,
      products: [
        {
          id: 2,
          quantity: 4,
        },
      ],
      remoteArea: false,
      coupons: [2, 4],
    },
  ];
  return rawOrderSheets;
};

export const orderSheetStore = {
  orderSheets: createOrderSheets(),
  reset() {
    this.orderSheets = createOrderSheets();
  },
};
