const initialState = {
  cart: [],
  isOpen: false
};

export const SET_CART = 'SET_CART';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const TOGGLE_CART = 'TOGGLE_CART';

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cart: action.payload
      };
    case ADD_TO_CART: {
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          count: updatedCart[existingItemIndex].count + 1
        };
        return {
          ...state,
          cart: updatedCart
        };
      }

      return {
        ...state,
        cart: [...state.cart, { product: action.payload, count: 1, checked: true }]
      };
    }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, ...action.payload.updates }
            : item
        )
      };
    case TOGGLE_CART:
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen
      };
    default:
      return state;
  }
}