import {CartItem} from './models/CartItem.js';
import {CartItems} from './models/CartItems.js';
import {Product} from './models/Product.js';
import {Products} from './models/Products.js';

const productList = [
  new Product(
    '1',
    '자유로운 준',
    7,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '2',
    '멋있는 시지프',
    99,
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '3',
    '두부 같은 두부',
    500,
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '4',
    '포도 같은 포도',
    2500,
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '5',
    '노티드 도넛',
    12000,
    'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '6',
    '다중인격 콘티',
    89000,
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '7',
    '칠월',
    450000,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '8',
    '툴툴리니',
    3500000,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '9',
    '삔지',
    18000000,
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80'
  ),
  new Product(
    '10',
    '제적당하기 직전 이스타',
    72000000,
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=300&q=80'
  ),
];

export const products = new Products(productList);

export const cartItems = new CartItems([
  new CartItem('1', productList[0], 1),
  new CartItem('2', productList[1], 1),
  new CartItem('3', productList[2], 2),
  new CartItem('4', productList[3], 3),
  new CartItem('5', productList[4], 3),
  new CartItem('6', productList[5], 5),
  new CartItem('7', productList[6], 8),
  new CartItem('8', productList[7], 13),
  new CartItem('9', productList[8], 21),
  new CartItem('10', productList[9], 34),
]);
