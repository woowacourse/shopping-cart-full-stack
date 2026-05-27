class Product {
  #name: string;
  #price: number;
  #thumbnail: string;

  constructor(name: string, price: number, thumbnail: string) {
    this.#name = name;
    this.#price = price;
    this.#thumbnail = thumbnail;
  }
}

export default Product;
