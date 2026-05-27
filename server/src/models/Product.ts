export interface ProductType {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
}

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

  getProduct() {
    return {
      id: this.#id,
      name: this.#name,
      price: this.#price,
      thumbnail: this.#thumbnail,
    };
  }
}

export default Product;
