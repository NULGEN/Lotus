import {
  SET_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  TOGGLE_CART
} from '../reducers/cartReducer';

export const setCart = (cart) => ({
  type: SET_CART,
  payload: cart
});

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId
});

export const updateCartItem = (productId, updates) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, updates }
});

export const toggleCart = (isOpen) => ({
  type: TOGGLE_CART,
  payload: isOpen
});