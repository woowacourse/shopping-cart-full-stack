export class Product {
  id: string;
  price: number;
  name: string;
  imgUrl: string;

  constructor({
    id,
    price,
    name,
    imgUrl,
  }: {
    id: string;
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
