import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../common/Spinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { EmptyCart } from "./EmptyCart";
import { CartList } from "./CartList";
import { useCart } from "../hooks/useCart";
import {
  deleteCartItemApi,
  getCartApi,
  updateQuantityApi,
} from "../api/cartApi";
import { createOrderApi } from "../api/orderApi";
import type { OrderCheckInfo } from "../types/cart";

export function CartPage() {
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const { loading, error, cartItems, updateQuantity, deleteItem } = useCart({
    fetchCart: getCartApi,
    updateCart: updateQuantityApi,
    deleteCart: deleteCartItemApi,
  });

  async function handleOrderCheck({ products }: OrderCheckInfo) {
    setOrdering(true);
    try {
      const orderId = await createOrderApi(products);
      navigate(`/checkout/${orderId}`);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "OUT_OF_STOCK") {
          alert("재고가 부족한 상품이 있습니다.");
        } else if (e.message === "NOT_EXIST_PRODUCT") {
          alert("존재하지 않는 상품이 포함되어 있습니다.");
        } else {
          alert("주문에 실패했습니다. 다시 시도해 주세요.");
        }
      }
    } finally {
      setOrdering(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <CartList
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      onDeleteItem={deleteItem}
      onOrderCheck={handleOrderCheck}
      ordering={ordering}
    />
  );
}
