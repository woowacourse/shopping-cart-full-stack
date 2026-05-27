export interface BodyForTest {
  id?: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface TestDB {
  Products: BodyForTest[] | undefined;
  Cart: BodyForTest[] | undefined;
}

export const TestDB: TestDB = {
  Products: [
    {
      id: 1,
      imageUrl: 'https://example.com/nike.jpg',
      name: 'Nike Air Max',
      price: 1200000,
      quantity: 2,
    },
    {
      id: 2,
      imageUrl: 'https://example.com/uniqlo.jpg',
      name: 'Uniqlo Backpack',
      price: 50000,
      quantity: 1,
    },
  ],
  Cart: [
    {
      id: 1,
      imageUrl: 'https://example.com/nike.jpg',
      name: 'Nike Air Max',
      price: 1200000,
      quantity: 2,
    },
  ],
};
