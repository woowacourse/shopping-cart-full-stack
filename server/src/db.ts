import {CartItem} from './models/CartItem.js';
import {CartItems} from './models/CartItems.js';
import {Product} from './models/Product.js';
import {Products} from './models/Products.js';

const productList = [
  new Product('1', 'EASTER', 100000000000, '/testURL1'),
  new Product('2', 'PARADI', 1, '/testURL2'),
  new Product('3', 'BIBIBING', 2000, '/testURL3'),
  new Product('4', 'ZO', 20000000, '/testURL4'),
  new Product('5', '6month', 2, '/testURL5'),
];

export const products = new Products(productList);

export const cartItems = new CartItems([
  new CartItem('1', productList[0], 1),
  new CartItem('2', productList[1], 2),
  new CartItem('3', productList[4], 98),
]);
