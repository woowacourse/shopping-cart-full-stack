import { createShopApp } from "./shop/factory.js";
import { SEED_DATA } from "./shop/data.js";
import Product from "./shop/models/Product.js";

const PORT = process.env.PORT ?? 3000;

const { app, productRepository, cartRepository, couponRepository } = createShopApp();

const cart = cartRepository.get();
for (const { quantity, ...productData } of SEED_DATA["products"]) {
  const product = new Product(productData);
  productRepository.save(product.getId(), product);
  cart.updateItemByProductId(product.getId(), quantity);
}

for (const coupon of SEED_DATA["coupons"]) {
  couponRepository.save(coupon.getId(), coupon);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
