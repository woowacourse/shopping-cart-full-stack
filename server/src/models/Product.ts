class Product {
  #id: string;
  #name: string;
  #price: number;
  #thumbnail: string;

  constructor(name: string, price: number, thumbnail: string) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#price = price;
    this.#thumbnail = thumbnail;
  }
}

export default Product;
