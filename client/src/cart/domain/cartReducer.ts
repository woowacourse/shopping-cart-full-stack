import type {CartItem, CartItemId, CartItemsState} from './types.js';

type FetchSuccessPayload = Pick<CartItemsState, 'items'>;
type FetchErrorPayload = Pick<CartItemsState, 'errorMessage'>;
type CartItemIdPayload = {cartItemId: CartItemId};
type UpdateCartItemQuantityPayload = CartItemIdPayload & {quantity: CartItem['quantity']};

type CartItemsAction =
  | {type: 'fetchStart'}
  | {type: 'fetchSuccess'; payload: FetchSuccessPayload}
  | {type: 'fetchError'; payload: FetchErrorPayload}
  | {type: 'updateCartItemQuantity'; payload: UpdateCartItemQuantityPayload}
  | {type: 'deleteCartItem'; payload: CartItemIdPayload};

export function cartItemsReducer(state: CartItemsState, action: CartItemsAction): CartItemsState {
  switch (action.type) {
    case 'fetchStart': {
      return startFetchingCart(state);
    }
    case 'fetchSuccess': {
      return completeFetchingCart(state, action.payload);
    }
    case 'fetchError': {
      return failFetchingCart(state, action.payload);
    }
    case 'updateCartItemQuantity': {
      return updateCartItemQuantity(state, action.payload);
    }
    case 'deleteCartItem': {
      return deleteCartItem(state, action.payload.cartItemId);
    }
  }
}

// Fetch state functions

function startFetchingCart(state: CartItemsState): CartItemsState {
  return {
    ...state,
    status: 'loading',
    errorMessage: '',
  };
}

function completeFetchingCart(state: CartItemsState, payload: FetchSuccessPayload): CartItemsState {
  return {
    ...state,
    status: 'success',
    items: payload.items,
    errorMessage: '',
  };
}

function failFetchingCart(state: CartItemsState, payload: FetchErrorPayload): CartItemsState {
  return {
    ...state,
    status: 'error',
    errorMessage: payload.errorMessage,
  };
}

// Item state functions

function updateCartItemQuantity(state: CartItemsState, payload: UpdateCartItemQuantityPayload): CartItemsState {
  const updatedCartItems = state.items.map((cartItem) => {
    if (cartItem.id !== payload.cartItemId) return cartItem;

    return {...cartItem, quantity: payload.quantity};
  });

  return {
    ...state,
    items: updatedCartItems,
  };
}

function deleteCartItem(state: CartItemsState, cartItemId: CartItemId): CartItemsState {
  const remainingCartItems = state.items.filter((cartItem) => cartItem.id !== cartItemId);

  return {
    ...state,
    items: remainingCartItems,
  };
}
