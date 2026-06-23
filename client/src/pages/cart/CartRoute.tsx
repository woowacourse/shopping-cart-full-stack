import {
  deleteCartItem,
  fetchCartItems,
  updateAllCartItemsSelection,
  updateCartItemSelection,
  updateCartItemQuantity,
} from '../../entities/cart/api/cartApi';
import CartPage from './CartPage';
import CartProvider from './providers/CartProvider';

export default function CartRoute() {
  return (
    <CartProvider
      fetchItems={fetchCartItems}
      updateItemQuantity={updateCartItemQuantity}
      updateItemSelection={updateCartItemSelection}
      updateAllItemsSelection={updateAllCartItemsSelection}
      removeItem={deleteCartItem}
    >
      <CartPage />
    </CartProvider>
  );
}
