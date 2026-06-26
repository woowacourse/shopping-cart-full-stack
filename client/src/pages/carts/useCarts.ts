import { useState } from "react";

import { cartSelectionStorage } from "./cartSelectionStorage";

import { validateUpdateProductQuantity } from "./validate";

export interface CartProduct {
  id: number;
  quantity: number;
  name: string;
  price: number;
  imgUrl: string;
}

export interface UpdateProductQuantityCommand {
  id: number;
  quantity: number;
}

export interface DeleteProductParams {
  id: number;
}

export interface SelectionProduct {
  id: number;
  selected: boolean;
}

export const useCarts = () => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const [selectionProducts, setSelectionProducts] = useState<number[]>([]);

  const updateCartProducts = (products: CartProduct[]) => {
    setCartProducts(products);

    const savedSelections = cartSelectionStorage.load();
    const selectionProducts = savedSelections.length
      ? savedSelections
      : products.map((product: CartProduct) => product.id);

    setSelectionProducts(selectionProducts);
    cartSelectionStorage.save(selectionProducts);
  };

  const updateProductQuantity = ({
    id: productId,
    quantity,
  }: UpdateProductQuantityCommand) => {
    // 장바구니 상태(SSOT)에 유효하지 않은 수량이 저장되지 않도록 방어
    if (!validateUpdateProductQuantity(quantity)) return false;

    const changedCartProducts = cartProducts.map((product) => {
      return product.id !== productId ? product : { ...product, quantity };
    });

    setCartProducts(changedCartProducts);
  };

  const deleteProduct = ({ id: productId }: DeleteProductParams) => {
    const filteredCartProducts = cartProducts.filter((product) => {
      return product.id !== productId;
    });
    setCartProducts(filteredCartProducts);

    const filteredSelectionProducts = selectionProducts.filter(
      (id) => id !== productId,
    );
    setSelectionProducts(filteredSelectionProducts);
  };

  const updateProductSelection = ({
    id: productId,
    selected,
  }: {
    id: number;
    selected: boolean;
  }) => {
    const changedSelectionProducts = selected
      ? [...selectionProducts, productId]
      : selectionProducts.filter((id) => id !== productId);

    setSelectionProducts(changedSelectionProducts);
    cartSelectionStorage.save(changedSelectionProducts);
  };

  const updateAllProductSelection = ({ selected }: { selected: boolean }) => {
    const changedSelectionProducts = selected
      ? cartProducts.map((product: CartProduct) => product.id)
      : [];

    setSelectionProducts(changedSelectionProducts);
    cartSelectionStorage.save(changedSelectionProducts);
  };

  const cartProductsWithSelection = cartProducts.map((cartProduct) => {
    const selected = selectionProducts.includes(cartProduct.id);

    return { ...cartProduct, selected };
  });

  return {
    cartProducts: cartProductsWithSelection,
    selectionProducts,
    updateCartProducts,
    updateProductQuantity,
    deleteProduct,
    updateProductSelection,
    updateAllProductSelection,
  };
};
