interface RequestBody {
  id?: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface DB {
  Products: RequestBody[];
  Cart: RequestBody[];
}

export const DB: DB = {
  Products: [],
  Cart: [],
};
