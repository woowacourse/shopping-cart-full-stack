export class ProductNotFoundError extends Error {
  constructor(public readonly productId: string) {
    super('Product not found');
    this.name = 'ProductNotFoundError';
  }
}

export class CartItemNotFoundError extends Error {
  constructor(public readonly cartItemId: string) {
    super('Cart item not found');
    this.name = 'CartItemNotFoundError';
  }
}

export class ProductAlreadyInCartError extends Error {
  constructor(public readonly productId: string) {
    super('Product already exists in cart');
    this.name = 'ProductAlreadyInCartError';
  }
}

export class CartItemProductMissingError extends Error {
  constructor(
    public readonly cartItemId: string,
    public readonly productId: string,
  ) {
    super('Cart item references a missing product');
    this.name = 'CartItemProductMissingError';
  }
}
