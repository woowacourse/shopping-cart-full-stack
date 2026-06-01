interface RawProduct {
  id: number;
  price: number;
  name: string;
  imgUrl: string;
}
const createInitialRawProducts = () => {
  const rawProducts: RawProduct[] = [
    {
      id: 1,
      price: 18000,
      name: "Shopping Basket",
      imgUrl: "https://example.com/images/shopping-basket.png",
    },
    {
      id: 2,
      price: 32000,
      name: "Tote Bag",
      imgUrl: "https://example.com/images/tote-bag.png",
    },
    {
      id: 3,
      price: 9900,
      name: "Reusable Cup",
      imgUrl: "https://example.com/images/reusable-cup.png",
    },
  ];

  return rawProducts;
};

export const productStore = {
  products: createInitialRawProducts(),
  reset() {
    this.products = createInitialRawProducts();
  },
};
