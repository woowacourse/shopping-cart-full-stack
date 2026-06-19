import {cartItemData} from '../data/cartItems.js';
import {couponData} from '../data/coupons.js';
import {productData} from '../data/products.js';
import {CartItem} from '../models/CartItem.js';
import {CartItems} from '../models/CartItems.js';
import {Product} from '../models/Product.js';
import {Products} from '../models/Products.js';

const productList = productData.map(({id, name, price, imageUrl}) => new Product(id, name, price, imageUrl));

const findProductById = (productId: string) => {
  const product = productList.find(({id}) => id === productId);

  if (!product) {
    throw new Error(`존재하지 않는 상품 ID입니다: ${productId}`);
  }

  return product;
};

export const products = new Products(productList);

export const cartItems = new CartItems(
  cartItemData.map(({id, productId, quantity}) => new CartItem(id, findProductById(productId), quantity))
);

export const coupons = couponData;
