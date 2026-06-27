import app from './app.js';
import { cartItemsDB, productsDB } from './db.js';
import { CartItem } from './modules/cart/cartItem.model.js';
import { Product } from './modules/products/product.model.js';

const PORT = process.env.PORT ?? 3000;

export const seedInitialData = () => {
  if (productsDB.size > 0) return;

  const productA = new Product({
    productId: 'product-1',
    productName: '콜라',
    productPrice: 12000,
    remainingQuantity: 25,
    imageUrl:
      'https://i.namu.wiki/i/O_C6hvISxb9ndvytfAMu_zJll2D1JXK0oe4oLfPc8GVb4K7XG4f2SlH72dgi99pMw5TpdgtoXu6wGua_BsgPdA.webp',
  });
  const productB = new Product({
    productId: 'product-2',
    productName: '사이다',
    productPrice: 24000,
    remainingQuantity: 50,
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Cider_%28lemon-lime_drink%29.jpg',
  });

  const productC = new Product({
    productId: 'product-3',
    productName: '환타',
    productPrice: 1500,
    remainingQuantity: 99,
    imageUrl:
      'https://www.coca-cola.com/content/dam/onexp/kr/ko/brands/fanta/2025-fanta-packshot-fanta-orange.png',
  });

  productsDB.set(productA.productId, productA);
  productsDB.set(productB.productId, productB);
  productsDB.set(productC.productId, productC);

  cartItemsDB.set(
    'cart-item-1',
    new CartItem({
      cartItemId: 'cart-item-1',
      productId: productA.productId,
      purchaseQuantity: 4,
    }),
  );
  cartItemsDB.set(
    'cart-item-2',
    new CartItem({
      cartItemId: 'cart-item-2',
      productId: productB.productId,
      purchaseQuantity: 2,
    }),
  );
  cartItemsDB.set(
    'cart-item-3',
    new CartItem({
      cartItemId: 'cart-item-3',
      productId: productC.productId,
      purchaseQuantity: 3,
    }),
  );
};

if (process.env.SEED_INITIAL_DATA === 'true') {
  seedInitialData();
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
