import CartFail from "./CartFail";
import CartLoading from "./CartLoading";

import { useCartContext } from "../../CartContext";
import CartSuccess from "./CartSuccess/CartSuccess";

const CartPageBody = () => {
  const { getCartItemsAsyncState } = useCartContext();

  switch (getCartItemsAsyncState.status) {
    case "idle": {
      return <CartLoading />;
    }
    case "loading": {
      return <CartLoading />;
    }
    case "fail": {
      return <CartFail message={getCartItemsAsyncState.error.message} />;
    }
    case "success": {
      const cartItems = getCartItemsAsyncState.data;
      return <CartSuccess cartItems={cartItems} />;
    }
    default: {
      return <CartFail message="알 수 없는 에러가 발생했습니다." />;
    }
  }
};

export default CartPageBody;
