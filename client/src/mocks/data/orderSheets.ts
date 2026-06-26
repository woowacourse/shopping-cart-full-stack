export const orderSheets = [
  {
    items: [
      {
        product: {
          id: 1,
          name: "Shopping Basket",
          price: 18000,
          imgUrl: "https://example.com/images/shopping-basket.png",
        },
        quantity: 2,
      },
      {
        product: {
          id: 3,
          name: "Reusable Cup",
          price: 9900,
          imgUrl: "https://example.com/images/reusable-cup.png",
        },
        quantity: 1,
      },
    ],
    isRemoteShippingArea: false,
    selectedCoupons: [4],
  },
  {
    items: [
      {
        product: {
          id: 2,
          name: "Tote Bag",
          price: 32000,
          imgUrl: "https://example.com/images/shopping-basket.png",
        },
        quantity: 1,
      },
      {
        product: {
          id: 3,
          name: "Reusable Cup",
          price: 9900,
          imgUrl: "https://example.com/images/reusable-cup.png",
        },
        quantity: 1,
      },
    ],
    isRemoteShippingArea: false,
    selectedCoupons: [4],
  },
  {
    items: [
      {
        product: {
          id: 2,
          name: "Tote Bag",
          price: 32000,
          imgUrl: "https://example.com/images/shopping-basket.png",
        },
        quantity: 4,
      },
    ],
    isRemoteShippingArea: false,
    selectedCoupons: [2, 4],
  },
];

export const pricing = {
  orderAmount: 49500,
  couponDiscountAmount: 13770,
  shippingFee: 3000,
  paymentAmount: 38730,
};
