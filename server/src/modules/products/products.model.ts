export class Product {
  id: number;
  price: number;
  name: string;
  imgUrl: string;

  constructor({
    id,
    price,
    name,
    imgUrl,
  }: {
    id: number;
    price: number;
    name: string;
    imgUrl: string;
  }) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.imgUrl = imgUrl;
  }
}
