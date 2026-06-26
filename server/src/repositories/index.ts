import {productData} from '../data/products.js';
import {cartItemData} from '../data/cartItems.js';
import {couponData} from '../data/coupons.js';

import {Product} from '../models/Product.js';
import {Products} from '../models/Products.js';
import {CartItem} from '../models/CartItem.js';
import {CartItems} from '../models/CartItems.js';
import {Coupon} from '../models/Coupon.js';
import {Coupons} from '../models/Coupons.js';
import {Orders} from '../models/Orders.js';

const productList = productData.map(({id, name, price, imageUrl}) => new Product(id, name, price, imageUrl));

export const products = new Products(productList);

const cartItemList = cartItemData.map(({id, productId, quantity}) => {
  const product = products.findById(productId);

  if (!product) {
    throw new Error(`존재하지 않는 상품 ID입니다: ${productId}`);
  }

  return new CartItem(id, product, quantity);
});

export const cartItems = new CartItems(cartItemList);

const couponList = couponData.map((coupon) => new Coupon(coupon));

export const coupons = new Coupons(couponList);

export const orders = new Orders();
