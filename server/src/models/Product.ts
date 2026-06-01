export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly imageUrl: string
  ) {}

  hasName(name: string) {
    return this.name === name;
  }
}
