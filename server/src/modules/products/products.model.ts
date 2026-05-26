export class Product {
  constructor(
    public readonly id: string,
    public readonly price: number,
    public readonly name: string,
    public readonly imgUrl: string,
  ) {}
}
