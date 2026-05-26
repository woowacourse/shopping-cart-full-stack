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
    this.name = name;
    this.price = price;
    this.image = image;
    this.id = crypto.randomUUID();
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
