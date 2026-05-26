export default class Product {
  private name: string;
  private price: number;
  private image?: string | null;
  private id: string;

  constructor({
    name,
    price,
    image,
  }: {
    name: string;
    price: number;
    image?: string;
  }) {
    this.#validatorName(name);
    this.#validatorPrice(price);
    this.name = name;
    this.price = price;
    this.image = image;
    this.id = crypto.randomUUID();
  }

  #validatorName(name: string) {
    if (name.length === 0) throw new Error('상품명이 공백입니다.');

    if (name.length > 100) throw new Error('상품명이 100자를 초과합니다.');
  }

  #validatorPrice(price: number) {
    if (price <= 0) throw new Error('가격은 1원 이상입니다.');
  }

  getProduct() {
    return {
      name: this.name,
      price: this.price,
      image: this.image,
      id: this.id,
    };
  }
}
