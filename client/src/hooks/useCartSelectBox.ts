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

  const save = (map: Map<number, boolean>) => {
    setSelectedItems(map);
    localStorage.setItem("storedCartItems", JSON.stringify([...map]));
  };

  const onToggle = (cartItemId: number) => {
    const newMap = new Map(selectedItems);
    newMap.set(cartItemId, !selectedItems.get(cartItemId));
    save(newMap);
  };

  const onToggleAll = () => {
    const allSelected = [...selectedItems.values()].every(
      (value) => value === true,
    );
    const newMap = new Map(selectedItems);
    newMap.forEach((_, key) => newMap.set(key, !allSelected));
    save(newMap);
  };
  return { selectedItems, onToggle, onToggleAll };
}
