import { useEffect, useState } from "react";
import { CartItem } from "../type/types";

interface Props {
  cartItems: CartItem[];
}

export default function useCartSelectBox({ cartItems }: Props) {
  const [selectedItems, setSelectedItems] = useState<Map<number, boolean>>(
    new Map(),
  );

  useEffect(() => {
    if (cartItems.length === 0) return;
    const stored = localStorage.getItem("storedCartItems");
    if (stored) {
      setSelectedItems(new Map(JSON.parse(stored)));
    } else {
      setSelectedItems(
        new Map(cartItems.map((item) => [item.cartItemId, true])),
      );
    }
  }, [cartItems]);

  const onToggle = (cartItemId: number) => {
    const newMap = new Map(selectedItems);
    newMap.set(cartItemId, !selectedItems.get(cartItemId));
    setSelectedItems(newMap);
    localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
  };

  const onToggleAll = () => {
    if ([...selectedItems.values()].every((value) => value === true)) {
      const newMap = new Map(selectedItems);
      newMap.forEach((_, key) => {
        newMap.set(key, false);
      });
      setSelectedItems(newMap);
      localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
    } else {
      const newMap = new Map(selectedItems);
      newMap.forEach((_, key) => {
        newMap.set(key, true);
      });
      setSelectedItems(newMap);
      localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
    }
  };
  return { selectedItems, setSelectedItems, onToggle, onToggleAll };
}
