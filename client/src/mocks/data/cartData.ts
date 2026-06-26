import type { Product } from '../../apis/cart';

export const products: Product[] = [
  {
    id: '1',
    name: '운동화',
    thumbnail: 'https://placehold.co/211x211?text=Sneakers',
    price: 35000,
  },
  {
    id: '2',
    name: '양말',
    thumbnail: 'https://placehold.co/211x211?text=Socks',
    price: 25000,
  },
  {
    id: '3',
    name: '양말',
    thumbnail: 'https://placehold.co/211x211?text=Socks',
    price: 25000,
  },
];

let cartItems = [
  {
    productId: '1',
    quantity: 2,
  },
  {
    productId: '2',
    quantity: 2,
  },
  {
    productId: '3',
    quantity: 98,
  },
];

export const getProduct = (productId: string) =>
  products.find((product) => product.id === productId);

export const getCartItem = (productId: string) =>
  cartItems.find((item) => item.productId === productId);

export const getCartItems = () =>
  cartItems.flatMap(({ productId, quantity }) => {
    const product = getProduct(productId);

    return product ? [{ product, quantity }] : [];
  });

export const removeCartItem = (productId: string) => {
  cartItems = cartItems.filter((item) => item.productId !== productId);
};
